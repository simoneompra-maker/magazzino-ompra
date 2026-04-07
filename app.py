"""
Incrocio Listino + Giacenze
Production-ready Streamlit app to merge a product catalog with warehouse stock data.
"""

import io
import pandas as pd
import streamlit as st


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
DEFAULT_STOCK_COL_INDEX = 15
OUTPUT_SEPARATOR = ";"
OUTPUT_ENCODING = "utf-8"

CATALOG_KEY = "Codice_articolo"
STOCK_KEY = "Codice_articolo"
GIACENZA_COL = "Giacenza"

OUTPUT_COLUMNS = ["Codice_articolo", "Descrizione_articolo", "Prezzo", "Giacenza"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalize_code(series: pd.Series) -> pd.Series:
    """Strip whitespace, uppercase, and cast to string."""
    return series.astype(str).str.strip().str.upper()


# ---------------------------------------------------------------------------
# Catalog loading
# ---------------------------------------------------------------------------

def load_catalog(file) -> pd.DataFrame:
    """
    Load the product catalog from a CSV or Excel file.

    Required columns: Codice_articolo, one containing 'Descrizione', one containing 'Prezzo'.
    Returns a DataFrame with exactly: Codice_articolo, Descrizione_articolo, Prezzo.
    """
    filename = file.name.lower()

    if filename.endswith((".xlsx", ".xls")):
        df = pd.read_excel(file, dtype=str)
    else:
        # Try common CSV separators
        raw = file.read()
        file.seek(0)
        sample = raw[:4096].decode("utf-8", errors="replace")
        sep = ";" if sample.count(";") > sample.count(",") else ","
        df = pd.read_csv(file, sep=sep, dtype=str, low_memory=False)

    df.columns = df.columns.str.strip()

    # --- Locate required columns ---
    if CATALOG_KEY not in df.columns:
        raise ValueError(
            f"Colonna '{CATALOG_KEY}' non trovata nel listino. "
            f"Colonne disponibili: {list(df.columns)}"
        )

    desc_col = next((c for c in df.columns if "descrizione" in c.lower()), None)
    if desc_col is None:
        raise ValueError(
            "Nessuna colonna contenente 'Descrizione' trovata nel listino."
        )

    prezzo_col = next((c for c in df.columns if "prezzo" in c.lower()), None)
    if prezzo_col is None:
        raise ValueError(
            "Nessuna colonna contenente 'Prezzo' trovata nel listino."
        )

    catalog = df[[CATALOG_KEY, desc_col, prezzo_col]].copy()
    catalog.columns = ["Codice_articolo", "Descrizione_articolo", "Prezzo"]
    catalog["Codice_articolo"] = normalize_code(catalog["Codice_articolo"])

    # Drop rows with empty key
    catalog = catalog[catalog["Codice_articolo"].str.len() > 0].reset_index(drop=True)

    return catalog


# ---------------------------------------------------------------------------
# Stock loading
# ---------------------------------------------------------------------------

def load_stock(file, stock_col_index: int = DEFAULT_STOCK_COL_INDEX) -> pd.DataFrame:
    """
    Load the warehouse stock file.

    Non-standard structure: data comes in pairs of rows.
      Row 1 (even index 0, 2, 4…): article code in column 0
      Row 2 (odd  index 1, 3, 5…): numeric values; stock qty at `stock_col_index`

    Returns a DataFrame with: Codice_articolo, Giacenza (aggregated by sum).
    """
    raw = file.read()
    file.seek(0)
    sample = raw[:4096].decode("utf-8", errors="replace")
    sep = ";" if sample.count(";") > sample.count(",") else ","

    df = pd.read_csv(
        io.BytesIO(raw),
        sep=sep,
        header=None,
        dtype=str,
        low_memory=False,
        skip_blank_lines=False,
    )

    records = []
    for i in range(0, len(df) - 1, 2):
        code = str(df.iloc[i, 0]).strip().upper()
        if not code or code in ("NAN", ""):
            continue
        try:
            qty_raw = df.iloc[i + 1, stock_col_index]
            qty = pd.to_numeric(qty_raw, errors="coerce")
            qty = float(qty) if pd.notna(qty) else 0.0
        except (IndexError, TypeError, ValueError):
            qty = 0.0
        records.append({STOCK_KEY: code, GIACENZA_COL: qty})

    stock = pd.DataFrame(records, columns=[STOCK_KEY, GIACENZA_COL])

    # Aggregate: sum quantities per article code
    stock = (
        stock.groupby(STOCK_KEY, as_index=False)[GIACENZA_COL]
        .sum()
    )

    return stock


# ---------------------------------------------------------------------------
# Merge
# ---------------------------------------------------------------------------

def merge_catalog_stock(catalog: pd.DataFrame, stock: pd.DataFrame) -> pd.DataFrame:
    """
    LEFT JOIN catalog with stock on Codice_articolo.
    Missing stock values are filled with 0.
    Returns DataFrame with OUTPUT_COLUMNS.
    """
    merged = catalog.merge(stock, on=CATALOG_KEY, how="left")
    merged[GIACENZA_COL] = merged[GIACENZA_COL].fillna(0)

    # Ensure all output columns exist
    for col in OUTPUT_COLUMNS:
        if col not in merged.columns:
            merged[col] = ""

    return merged[OUTPUT_COLUMNS]


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

def to_csv_bytes(df: pd.DataFrame) -> bytes:
    """Serialize DataFrame to CSV bytes (UTF-8, semicolon separator)."""
    return df.to_csv(
        index=False,
        sep=OUTPUT_SEPARATOR,
        encoding=OUTPUT_ENCODING,
    ).encode(OUTPUT_ENCODING)


# ---------------------------------------------------------------------------
# Streamlit UI
# ---------------------------------------------------------------------------

def main():
    st.set_page_config(
        page_title="Incrocio Listino + Giacenze",
        page_icon="📦",
        layout="wide",
    )

    st.title("📦 Incrocio Listino + Giacenze")
    st.markdown(
        "Carica il **listino prodotti** e il **file giacenze** per ottenere "
        "il dataset unificato con le quantità in magazzino."
    )

    # ------------------------------------------------------------------
    # Sidebar – advanced options
    # ------------------------------------------------------------------
    with st.sidebar:
        st.header("⚙️ Opzioni avanzate")
        stock_col_index = st.number_input(
            "Indice colonna giacenza (0-based)",
            min_value=0,
            max_value=100,
            value=DEFAULT_STOCK_COL_INDEX,
            help=(
                "Indice (zero-based) della colonna nel file giacenze "
                "che contiene la quantità disponibile. Default: 15."
            ),
        )
        show_preview = st.checkbox("Mostra anteprima dati", value=True)
        preview_rows = st.slider(
            "Righe anteprima", min_value=5, max_value=100, value=20, step=5
        )

    # ------------------------------------------------------------------
    # File uploaders
    # ------------------------------------------------------------------
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("1️⃣ Listino prodotti")
        catalog_file = st.file_uploader(
            "Carica listino (CSV o Excel)",
            type=["csv", "xlsx", "xls"],
            key="catalog",
        )

    with col2:
        st.subheader("2️⃣ File giacenze")
        stock_file = st.file_uploader(
            "Carica giacenze (CSV)",
            type=["csv"],
            key="stock",
        )

    # ------------------------------------------------------------------
    # Processing
    # ------------------------------------------------------------------
    if catalog_file and stock_file:
        st.divider()
        status = st.status("Elaborazione in corso…", expanded=True)

        try:
            with status:
                st.write("📂 Caricamento listino…")
                catalog = load_catalog(catalog_file)
                st.write(f"   ✅ {len(catalog):,} articoli nel listino.")

                st.write("📂 Caricamento giacenze…")
                stock = load_stock(stock_file, stock_col_index=int(stock_col_index))
                st.write(f"   ✅ {len(stock):,} codici trovati nel file giacenze.")

                st.write("🔗 Unione dati…")
                result = merge_catalog_stock(catalog, stock)
                st.write("   ✅ Merge completato.")

            status.update(label="Elaborazione completata!", state="complete")

            # ----------------------------------------------------------
            # KPI metrics
            # ----------------------------------------------------------
            total = len(result)
            with_stock = int((result[GIACENZA_COL] > 0).sum())
            without_stock = total - with_stock

            m1, m2, m3 = st.columns(3)
            m1.metric("Totale articoli", f"{total:,}")
            m2.metric("Articoli con giacenza > 0", f"{with_stock:,}")
            m3.metric("Articoli senza giacenza", f"{without_stock:,}")

            # ----------------------------------------------------------
            # Preview
            # ----------------------------------------------------------
            if show_preview:
                st.subheader("🔍 Anteprima risultato")
                st.dataframe(
                    result.head(preview_rows),
                    use_container_width=True,
                    hide_index=True,
                )

            # ----------------------------------------------------------
            # Download
            # ----------------------------------------------------------
            st.subheader("⬇️ Esporta risultato")
            csv_bytes = to_csv_bytes(result)

            st.download_button(
                label="📥 Scarica CSV (separatore ;)",
                data=csv_bytes,
                file_name="incrocio_listino_giacenze.csv",
                mime="text/csv",
                type="primary",
            )

            st.success(
                f"✅ Dataset pronto: {total:,} articoli, "
                f"{with_stock:,} con giacenza disponibile."
            )

        except ValueError as exc:
            status.update(label="Errore nei dati", state="error")
            st.error(f"❌ Errore nei dati: {exc}")
        except Exception as exc:
            status.update(label="Errore imprevisto", state="error")
            st.error(f"❌ Errore imprevisto: {exc}")
            st.exception(exc)

    else:
        st.info("⬆️ Carica entrambi i file per avviare l'elaborazione.")


if __name__ == "__main__":
    main()
