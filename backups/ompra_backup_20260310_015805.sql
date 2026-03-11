--
-- PostgreSQL database dump
--

\restrict 9mle8sIZZAOFvkav5l0k3E2qq0a2pJdR99HyBy2m0MzWfRnK7gtBb5qyT4Bg27B

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime_messages_publication;
DROP PUBLICATION IF EXISTS supabase_realtime;
DROP POLICY IF EXISTS "Enable all access for now" ON public.inventory;
DROP POLICY IF EXISTS "Enable all access" ON public.pricing_policies;
DROP POLICY IF EXISTS "Allow all operations on commissioni" ON public.commissioni;
DROP POLICY IF EXISTS "Allow all operations on clienti" ON public.clienti;
DROP POLICY IF EXISTS "Allow all on stock_thresholds" ON public.stock_thresholds;
DROP POLICY IF EXISTS "Allow all on app_config" ON public.app_config;
DROP POLICY IF EXISTS "Allow all" ON public.operatori;
DROP POLICY IF EXISTS "Allow all" ON public.listini_log;
DROP POLICY IF EXISTS "Accesso completo listini" ON public.listini;
DROP POLICY IF EXISTS "Accesso autenticati liquidi prodotti" ON public.pv_liquidi_prodotti;
DROP POLICY IF EXISTS "Accesso autenticati liquidi" ON public.pv_liquidi_programmati;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.pv_preventivo_righe DROP CONSTRAINT IF EXISTS pv_preventivo_righe_prodotto_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_preventivo_righe DROP CONSTRAINT IF EXISTS pv_preventivo_righe_preventivo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_preventivi DROP CONSTRAINT IF EXISTS pv_preventivi_piano_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_liquidi_programmati DROP CONSTRAINT IF EXISTS pv_liquidi_programmati_piano_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_liquidi_prodotti DROP CONSTRAINT IF EXISTS pv_liquidi_prodotti_prodotto_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_liquidi_prodotti DROP CONSTRAINT IF EXISTS pv_liquidi_prodotti_liquido_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_kit_prodotti DROP CONSTRAINT IF EXISTS pv_kit_prodotti_prodotto_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_kit_prodotti DROP CONSTRAINT IF EXISTS pv_kit_prodotti_kit_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_intervento_prodotti DROP CONSTRAINT IF EXISTS pv_intervento_prodotti_prodotto_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_intervento_prodotti DROP CONSTRAINT IF EXISTS pv_intervento_prodotti_intervento_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pv_interventi DROP CONSTRAINT IF EXISTS pv_interventi_piano_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS protect_objects_delete ON storage.objects;
DROP TRIGGER IF EXISTS protect_buckets_delete ON storage.buckets;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP TRIGGER IF EXISTS stock_thresholds_updated_at ON public.stock_thresholds;
DROP TRIGGER IF EXISTS inventory_auto_threshold ON public.inventory;
DROP TRIGGER IF EXISTS clienti_updated_at ON public.clienti;
DROP INDEX IF EXISTS storage.vector_indexes_name_bucket_id_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name_lower;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.buckets_analytics_unique_name_idx;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_action_filter_key;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.idx_stock_thresholds_brand_model;
DROP INDEX IF EXISTS public.idx_status;
DROP INDEX IF EXISTS public.idx_serial;
DROP INDEX IF EXISTS public.idx_pv_prodotti_slug;
DROP INDEX IF EXISTS public.idx_pv_preventivi_cliente;
DROP INDEX IF EXISTS public.idx_pv_piani_slug;
DROP INDEX IF EXISTS public.idx_pv_piani_fase;
DROP INDEX IF EXISTS public.idx_pv_interventi_piano;
DROP INDEX IF EXISTS public.idx_commissioni_status;
DROP INDEX IF EXISTS public.idx_commissioni_privacy_pending;
DROP INDEX IF EXISTS public.idx_commissioni_is_preventivo;
DROP INDEX IF EXISTS public.idx_commissioni_created;
DROP INDEX IF EXISTS public.idx_commissioni_cliente;
DROP INDEX IF EXISTS public.idx_clienti_search_text;
DROP INDEX IF EXISTS public.idx_clienti_piva;
DROP INDEX IF EXISTS public.idx_clienti_deleted_at;
DROP INDEX IF EXISTS public.idx_clienti_cf;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_oauth_client_states_created_at;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets_vectors DROP CONSTRAINT IF EXISTS buckets_vectors_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_12 DROP CONSTRAINT IF EXISTS messages_2026_03_12_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_11 DROP CONSTRAINT IF EXISTS messages_2026_03_11_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_10 DROP CONSTRAINT IF EXISTS messages_2026_03_10_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_09 DROP CONSTRAINT IF EXISTS messages_2026_03_09_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_08 DROP CONSTRAINT IF EXISTS messages_2026_03_08_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_07 DROP CONSTRAINT IF EXISTS messages_2026_03_07_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_06 DROP CONSTRAINT IF EXISTS messages_2026_03_06_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.stock_thresholds DROP CONSTRAINT IF EXISTS stock_thresholds_pkey;
ALTER TABLE IF EXISTS ONLY public.stock_thresholds DROP CONSTRAINT IF EXISTS stock_thresholds_brand_model_unique;
ALTER TABLE IF EXISTS ONLY public.pv_prodotti DROP CONSTRAINT IF EXISTS pv_prodotti_slug_key;
ALTER TABLE IF EXISTS ONLY public.pv_prodotti DROP CONSTRAINT IF EXISTS pv_prodotti_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_preventivo_righe DROP CONSTRAINT IF EXISTS pv_preventivo_righe_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_preventivi DROP CONSTRAINT IF EXISTS pv_preventivi_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_preventivi DROP CONSTRAINT IF EXISTS pv_preventivi_numero_key;
ALTER TABLE IF EXISTS ONLY public.pv_piani DROP CONSTRAINT IF EXISTS pv_piani_slug_key;
ALTER TABLE IF EXISTS ONLY public.pv_piani DROP CONSTRAINT IF EXISTS pv_piani_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_liquidi_programmati DROP CONSTRAINT IF EXISTS pv_liquidi_programmati_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_liquidi_prodotti DROP CONSTRAINT IF EXISTS pv_liquidi_prodotti_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_kit DROP CONSTRAINT IF EXISTS pv_kit_slug_key;
ALTER TABLE IF EXISTS ONLY public.pv_kit_prodotti DROP CONSTRAINT IF EXISTS pv_kit_prodotti_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_kit DROP CONSTRAINT IF EXISTS pv_kit_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_intervento_prodotti DROP CONSTRAINT IF EXISTS pv_intervento_prodotti_pkey;
ALTER TABLE IF EXISTS ONLY public.pv_interventi DROP CONSTRAINT IF EXISTS pv_interventi_pkey;
ALTER TABLE IF EXISTS ONLY public.pricing_policies DROP CONSTRAINT IF EXISTS pricing_policies_pkey;
ALTER TABLE IF EXISTS ONLY public.pricing_policies DROP CONSTRAINT IF EXISTS pricing_policies_brand_key;
ALTER TABLE IF EXISTS ONLY public.operatori DROP CONSTRAINT IF EXISTS operatori_pkey;
ALTER TABLE IF EXISTS ONLY public.operatori DROP CONSTRAINT IF EXISTS operatori_nome_key;
ALTER TABLE IF EXISTS ONLY public.listini DROP CONSTRAINT IF EXISTS listini_pkey;
ALTER TABLE IF EXISTS ONLY public.listini_log DROP CONSTRAINT IF EXISTS listini_log_pkey;
ALTER TABLE IF EXISTS ONLY public.listini DROP CONSTRAINT IF EXISTS listini_brand_codice_key;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pkey;
ALTER TABLE IF EXISTS ONLY public.commissioni DROP CONSTRAINT IF EXISTS commissioni_pkey;
ALTER TABLE IF EXISTS ONLY public.clienti DROP CONSTRAINT IF EXISTS clienti_search_text_unique;
ALTER TABLE IF EXISTS ONLY public.clienti DROP CONSTRAINT IF EXISTS clienti_pkey;
ALTER TABLE IF EXISTS ONLY public.app_config DROP CONSTRAINT IF EXISTS app_config_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_client_states DROP CONSTRAINT IF EXISTS oauth_client_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS public.inventory ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.vector_indexes;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_vectors;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages_2026_03_12;
DROP TABLE IF EXISTS realtime.messages_2026_03_11;
DROP TABLE IF EXISTS realtime.messages_2026_03_10;
DROP TABLE IF EXISTS realtime.messages_2026_03_09;
DROP TABLE IF EXISTS realtime.messages_2026_03_08;
DROP TABLE IF EXISTS realtime.messages_2026_03_07;
DROP TABLE IF EXISTS realtime.messages_2026_03_06;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.stock_thresholds;
DROP TABLE IF EXISTS public.pv_prodotti;
DROP TABLE IF EXISTS public.pv_preventivo_righe;
DROP TABLE IF EXISTS public.pv_preventivi;
DROP TABLE IF EXISTS public.pv_piani;
DROP TABLE IF EXISTS public.pv_liquidi_programmati;
DROP TABLE IF EXISTS public.pv_liquidi_prodotti;
DROP TABLE IF EXISTS public.pv_kit_prodotti;
DROP TABLE IF EXISTS public.pv_kit;
DROP TABLE IF EXISTS public.pv_intervento_prodotti;
DROP TABLE IF EXISTS public.pv_interventi;
DROP TABLE IF EXISTS public.pricing_policies;
DROP TABLE IF EXISTS public.operatori;
DROP TABLE IF EXISTS public.listini_log;
DROP TABLE IF EXISTS public.listini;
DROP SEQUENCE IF EXISTS public.inventory_id_seq;
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.commissioni;
DROP TABLE IF EXISTS public.clienti;
DROP TABLE IF EXISTS public.app_config;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_client_states;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.protect_delete();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_prefixes(name text);
DROP FUNCTION IF EXISTS storage.get_prefix(name text);
DROP FUNCTION IF EXISTS storage.get_level(name text);
DROP FUNCTION IF EXISTS storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.delete_leaf_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.update_stock_threshold_updated_at();
DROP FUNCTION IF EXISTS public.auto_create_stock_threshold();
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP EXTENSION IF EXISTS pg_graphql;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: auto_create_stock_threshold(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_create_stock_threshold() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO stock_thresholds (brand, model, min_quantity)
  VALUES (NEW.brand, NEW.model, 1)
  ON CONFLICT (brand, model) DO NOTHING;
  RETURN NEW;
END;
$$;


--
-- Name: update_stock_threshold_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_stock_threshold_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: app_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_config (
    key text NOT NULL,
    value text NOT NULL
);


--
-- Name: clienti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clienti (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    nome text,
    cognome text,
    nome_completo text,
    indirizzo text,
    cap text,
    localita text,
    provincia text,
    telefono text,
    email text,
    contatto text,
    codice_fiscale text,
    partita_iva text,
    search_text text,
    fonte text DEFAULT 'manuale'::text,
    deleted_at timestamp with time zone,
    sdi text
);


--
-- Name: commissioni; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commissioni (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    cliente text NOT NULL,
    cliente_info jsonb,
    telefono text,
    operatore text,
    prodotti jsonb DEFAULT '[]'::jsonb,
    accessori jsonb DEFAULT '[]'::jsonb,
    totale numeric DEFAULT 0,
    caparra numeric,
    metodo_pagamento text,
    note text,
    tipo_documento text DEFAULT 'scontrino'::text,
    status text DEFAULT 'pending'::text,
    completed_at timestamp with time zone,
    iva_compresa boolean DEFAULT true,
    user_id text,
    tipo_operazione text DEFAULT 'vendita'::text,
    privacy_required boolean DEFAULT false,
    privacy_acknowledged boolean DEFAULT false,
    is_preventivo boolean DEFAULT false
);


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory (
    id bigint NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    action text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    "serialNumber" text NOT NULL,
    cliente text,
    prezzo double precision,
    totale double precision,
    status text DEFAULT 'available'::text NOT NULL,
    "user" text,
    location text DEFAULT 'main'::text,
    carico_automatico boolean DEFAULT false
);


--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: listini; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listini (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand text NOT NULL,
    categoria text,
    codice text NOT NULL,
    descrizione text NOT NULL,
    confezione text,
    prezzo_a numeric(10,2),
    prezzo_b numeric(10,2),
    prezzo_c numeric(10,2),
    prezzo_d numeric(10,2),
    iva numeric(5,2),
    data_aggiornamento timestamp with time zone DEFAULT now(),
    prezzo_promo numeric(10,2),
    promo_dal date,
    promo_al date
);


--
-- Name: listini_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listini_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome_file text,
    brand text,
    n_prodotti integer,
    caricato_da text,
    caricato_il timestamp with time zone DEFAULT now(),
    versione text
);


--
-- Name: operatori; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operatori (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    creato_il timestamp with time zone DEFAULT now()
);


--
-- Name: pricing_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_policies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand text NOT NULL,
    cliente_privato text,
    professionista text,
    promozioni text,
    note text,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: pv_interventi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_interventi (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    piano_id uuid,
    label text NOT NULL,
    timing text,
    tipo text,
    nota text,
    sort_order integer DEFAULT 0,
    numero_ordine integer,
    periodo_bimestre text,
    saltato boolean DEFAULT false NOT NULL,
    colore_prato text,
    dose_effettiva numeric(8,2),
    note_tecniche text,
    CONSTRAINT pv_interventi_colore_prato_check CHECK ((colore_prato = ANY (ARRAY['intenso'::text, 'pallido'::text])))
);


--
-- Name: pv_intervento_prodotti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_intervento_prodotti (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    intervento_id uuid,
    prodotto_id uuid,
    dose_gm2 numeric NOT NULL,
    sort_order integer DEFAULT 0,
    dose_fissa boolean DEFAULT false,
    dose_fissa_label text
);


--
-- Name: pv_kit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_kit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    nome text NOT NULL,
    badge text,
    descrizione text,
    sort_order integer DEFAULT 0
);


--
-- Name: pv_kit_prodotti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_kit_prodotti (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kit_id uuid,
    prodotto_id uuid,
    dose_gm2 numeric,
    condizione text,
    nota text,
    sort_order integer DEFAULT 0
);


--
-- Name: pv_liquidi_prodotti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_liquidi_prodotti (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    liquido_id uuid,
    prodotto_id uuid,
    nome_prodotto text,
    dose numeric(8,2),
    unita text DEFAULT 'g/m²'::text
);


--
-- Name: pv_liquidi_programmati; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_liquidi_programmati (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    piano_id uuid,
    tipo text NOT NULL,
    mese_inizio integer,
    mese_fine integer,
    frequenza_giorni integer,
    attivo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pv_liquidi_programmati_mese_fine_check CHECK (((mese_fine >= 1) AND (mese_fine <= 12))),
    CONSTRAINT pv_liquidi_programmati_mese_inizio_check CHECK (((mese_inizio >= 1) AND (mese_inizio <= 12))),
    CONSTRAINT pv_liquidi_programmati_tipo_check CHECK ((tipo = ANY (ARRAY['standard'::text, 'ogni_20gg'::text, 'sabbioso'::text])))
);


--
-- Name: pv_piani; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_piani (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    label text NOT NULL,
    descrizione text,
    tipo_prato text,
    fase text,
    livello text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    linea text DEFAULT 'albatros'::text NOT NULL,
    terreno text DEFAULT 'normale'::text NOT NULL,
    data_inizio date,
    data_fine date,
    esteso_12_mesi boolean DEFAULT false NOT NULL,
    colore_prato text,
    CONSTRAINT pv_piani_colore_prato_check CHECK ((colore_prato = ANY (ARRAY['intenso'::text, 'pallido'::text]))),
    CONSTRAINT pv_piani_linea_check CHECK ((linea = ANY (ARRAY['albatros'::text, 'mivena'::text]))),
    CONSTRAINT pv_piani_terreno_check CHECK ((terreno = ANY (ARRAY['normale'::text, 'sabbioso'::text])))
);


--
-- Name: pv_preventivi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_preventivi (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero text,
    cliente_nome text,
    cliente_ref text,
    piano_id uuid,
    superficie_m2 numeric,
    tipo_prato text,
    listino text DEFAULT 'A'::text,
    totale_euro numeric,
    note text,
    stato text DEFAULT 'bozza'::text,
    created_by text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: pv_preventivo_righe; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_preventivo_righe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    preventivo_id uuid,
    prodotto_id uuid,
    qta_kg numeric,
    prezzo_unit numeric,
    totale numeric,
    sort_order integer DEFAULT 0
);


--
-- Name: pv_prodotti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pv_prodotti (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listino_codice text NOT NULL,
    listino_brand text NOT NULL,
    slug text NOT NULL,
    tipo text NOT NULL,
    icona text,
    is_liquido boolean DEFAULT false,
    dose_std_gm2 numeric,
    dose_sport_mult numeric DEFAULT 1.2,
    note_tecniche text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    linea text,
    su_ordinazione boolean DEFAULT false NOT NULL,
    CONSTRAINT pv_prodotti_linea_check CHECK ((linea = ANY (ARRAY['albatros'::text, 'mivena'::text, 'kare'::text, 'zefir'::text, 'coadiuvanti'::text, 'ares_seed'::text, 'altro'::text])))
);


--
-- Name: stock_thresholds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_thresholds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    min_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2026_03_06; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_06 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_07; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_07 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_08; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_08 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_09; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_09 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_10; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_10 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_11; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_11 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_03_12; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: messages_2026_03_06; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_06 FOR VALUES FROM ('2026-03-06 00:00:00') TO ('2026-03-07 00:00:00');


--
-- Name: messages_2026_03_07; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_07 FOR VALUES FROM ('2026-03-07 00:00:00') TO ('2026-03-08 00:00:00');


--
-- Name: messages_2026_03_08; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_08 FOR VALUES FROM ('2026-03-08 00:00:00') TO ('2026-03-09 00:00:00');


--
-- Name: messages_2026_03_09; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_09 FOR VALUES FROM ('2026-03-09 00:00:00') TO ('2026-03-10 00:00:00');


--
-- Name: messages_2026_03_10; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_10 FOR VALUES FROM ('2026-03-10 00:00:00') TO ('2026-03-11 00:00:00');


--
-- Name: messages_2026_03_11; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_11 FOR VALUES FROM ('2026-03-11 00:00:00') TO ('2026-03-12 00:00:00');


--
-- Name: messages_2026_03_12; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_12 FOR VALUES FROM ('2026-03-12 00:00:00') TO ('2026-03-13 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: app_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.app_config (key, value) FROM stdin;
stock_alerts_enabled	false
\.


--
-- Data for Name: clienti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clienti (id, created_at, updated_at, nome, cognome, nome_completo, indirizzo, cap, localita, provincia, telefono, email, contatto, codice_fiscale, partita_iva, search_text, fonte, deleted_at, sdi) FROM stdin;
859be52c-5ff1-45d3-8e47-4ff554728a96	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	AZ. AGR. Moz Moreno			VIA PASSO CAMPALTO, 15A - CAMPALTO	30100	VENEZIA	VE	3408032699	fattoriaimpronta@gmail.com		\N	\N	az. agr. moz moreno venezia 	migrazione	\N	\N
261a7915-ee90-4765-8365-fe199a9205bc	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	AZ. AGR. Vivai Piante Di Dragancea Andrei			VIA ARRIGO BOITO, 10 - BIANCADE	31056	RONCADE	TV	3282670287	andrei.dragancea@gmail.com		\N	\N	az. agr. vivai piante di dragancea andrei roncade 	migrazione	\N	\N
801e707a-242b-4c15-ad22-0b6e1fe776f5	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Bergamo Nello - Impresa Edile			VIA G. GALILEI N. 19	31048	SAN BIAGIO DI CALLALTA	TV	0422 897964			\N	\N	bergamo nello - impresa edile san biagio di callalta 	migrazione	\N	\N
aab0f8c6-cd23-40a0-bb56-3d2137d0591a	2026-03-09 09:53:17.719742+00	2026-03-09 09:53:17.719742+00	Denis	Battistel	Battistel Denis	Via Francescata 6	31048	San Biagio di Callalta	TV	3280864412	battisteldenis@gmail.com	\N	\N	\N	Battistel Denis	manuale	\N	\N
3f80ed4d-467a-445b-bec1-68899a8248bb	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Buffon Giancarlo			VIA MARONCELLI 6	31038	PAESE	TV	3496148085			\N	\N	buffon giancarlo paese 	migrazione	\N	\N
3d0adf61-de7a-4a05-a014-e84f0303f9d7	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Cadorin Roberto			VIA PARIS BORDONE, 39 - BIANCADE	31056	RONCADE	TV	3479715095			\N	\N	cadorin roberto roncade 	migrazione	\N	\N
a168c56d-e577-4eb2-b83c-1a4a61df1cd5	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Camarotto Michele			VIA PASSO LAMPOL, 27/A	30020	FOSSALTA DI PIAVE	VE	3484460983	saradilegui@libero.it		\N	\N	camarotto michele fossalta di piave 	migrazione	\N	\N
3dba584f-8c09-4aed-92f5-a797ad7ab50b	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Chiericati Massimo			VIA SEBASTIANO CABOTO, 13 - SELVANA	31100	TREVISO	TV	3407860739		Fronte Hotel Carletto	\N	\N	chiericati massimo treviso fronte hotel carletto	migrazione	\N	\N
07f49ea8-5d4e-4703-8ffb-33ad02dd8f34	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	D'AMELIO Vincenzo			VIA PRINCIPE, 85/A - MUSESTRE	31056	RONCADE	TV	3450818865			\N	\N	d'amelio vincenzo roncade 	migrazione	\N	\N
5a838744-02ab-4e62-bb27-c957ac1ff732	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Moretti Marco			VIA TIMAVO	31100	TREVISO	TV	3392050119	moretti72.marco@libero.it		\N	\N	moretti marco treviso 	migrazione	\N	\N
a30d71c6-49e4-4587-adc2-d9cb771e0186	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Nico Giardini Di Bastarolo Nicola			VIA G.B. GUIDINI, 29	31059	ZERO BRANCO	TV	3498200169	nickbast74@gmail.com		\N	\N	nico giardini di bastarolo nicola zero branco 	migrazione	\N	\N
1796fc21-d0ea-49ad-88f8-6408fedd44f3	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Piovesan Andrea			VIA PAVANI, 37A	31050	MONASTIER DI TREVISO	TV	3202725545			\N	\N	piovesan andrea monastier di treviso 	migrazione	\N	\N
228d5ee5-c6cb-4ce0-bb2f-be560f3e8697	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Sartori Luca			VIA S.ANTONINO 288	31100	TREVISO	TV	3494968896	sartoriluca74@gmail.com		\N	\N	sartori luca treviso 	migrazione	\N	\N
011079c2-ac84-4784-bc90-a7e665d8b79f	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	Balanza Marino			VIA CLAUDIA AUGUSTA, 6	31048	SAN BIAGIO DI CALLALTA	TV	3466323236			\N	\N	balanza marino san biagio di callalta 	migrazione	\N	\N
244f09c0-9929-48c0-bad3-89de8885fc48	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	Cenedese Andrea			VIA SAN MARTINO, 54 - SAN MARTINO	31048	SAN BIAGIO DI CALLALTA	TV	3318200684	andrea.cenedese@alice.it		\N	\N	cenedese andrea san biagio di callalta 	migrazione	\N	\N
283e21c4-9063-423f-891b-efe43fd36a87	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	COOP. Sociale Idee Verdi			VIA GALVANI, 16	35030	SELVAZZANO DENTRO	PD	3450914123	areacontabile@ideeverdi.it	CEL. Marco Neve	\N	\N	coop. sociale idee verdi selvazzano dentro cel. marco neve	migrazione	\N	\N
5c9499df-fe5f-4ac9-a0cd-601ff961f122	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	Gasparini Francesco			VIA CA' CORNER SUD, 49	30020	MEOLO	VE	3939936820	gasparini.francesco@virgilio.it		\N	\N	gasparini francesco meolo 	migrazione	\N	\N
a0f77d7b-6122-46c8-afb6-ce56c6356b80	2026-03-09 17:02:25.77655+00	2026-03-09 17:02:25.77655+00	MARCO	BROLLO	BROLLO MARCO	VIA FRIULI	31048	SAN BIAGIO DI CALLALTA	\N	\N	\N	\N	\N	\N	BROLLO MARCO	manuale	\N	\N
0df8653c-097f-41e7-87c9-01ba2d8f9c11	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	M&A Saterini Snc			VIA UGO FOSCOLO, 19	31100	TREVISO	TV	3341760622	saterinisnc@libero.it		\N	\N	m&a saterini snc treviso 	migrazione	\N	\N
2a4a4dd3-de02-4d91-a66d-75f51bf18ef6	2026-03-01 18:24:21.558338+00	2026-03-01 18:24:21.558338+00	Patruno Franco			VIA TREVISO MARE, 8	31048	SAN BIAGIO DI CALLALTA	TV	3935553311			\N	\N	patruno franco san biagio di callalta 	migrazione	\N	\N
9329ffa1-03e3-4100-9df4-7abcd8afbbfa	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Bisetto Mario			VIA CODALUNGA, 135	31030	CARBONERA	TV	3493730882			\N	\N	bisetto mario carbonera 	migrazione	\N	\N
45b79d4b-f42b-4ea0-a3ec-c5632485cb69	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Bonetto Franco			VIA ORTIGARA, 7 - FAGARE'	31048	SAN BIAGIO DI CALLALTA	TV	3452383445			\N	\N	bonetto franco san biagio di callalta 	migrazione	\N	\N
a78ddf9e-9b8e-4a33-9450-11e09edb35a8	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Eos Cooperativa Sociale			VIA OSPEDALE, 10	31033	CASTELFRANCO VENETO	TV	3402249187	info@eoscooperativa.it		\N	\N	eos cooperativa sociale castelfranco veneto 	migrazione	\N	\N
1b22bb1d-dcdf-4af7-af74-02311a3dda35	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Habitat Natura Di Simone Taffarello			VIA SAN FLORIANO, 11/A - OLMI	31048	SAN BIAGIO DI CALLALTA	TV	335312402	info@habitatnatura.it		\N	\N	habitat natura di simone taffarello san biagio di callalta 	migrazione	\N	\N
16b3b51f-d6df-46b0-8c27-7aa926ed023b	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Mareverde Srls			Via Zuccarini, 11	30016	JESOLO	VE	0421230013	info@vivaisorgon.it	Simone 335490390	\N	\N	mareverde srls jesolo simone 335490390	migrazione	\N	\N
1580243e-3528-49a9-aba1-ffb58a3c6067	2026-03-01 18:24:36.226009+00	2026-03-01 18:24:36.226009+00	Scomparin Pierino			VIA BELVEDERE, 71	31057	SILEA	TV	3394191177			\N	\N	scomparin pierino silea 	migrazione	\N	\N
8af0ed4c-1596-4504-bb74-151868b8b448	2026-03-07 03:59:52.034349+00	2026-03-07 04:03:11.935774+00	Simone	Taffarello	Taffarello Simone	VIA PIAVE 71	31023	Resana	TV	335312402	simonetaffarello@gmail.com	\N	\N	\N	Taffarello Simone	manuale	2026-03-07 04:03:11.781+00	\N
\.


--
-- Data for Name: commissioni; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.commissioni (id, created_at, cliente, cliente_info, telefono, operatore, prodotti, accessori, totale, caparra, metodo_pagamento, note, tipo_documento, status, completed_at, iva_compresa, user_id, tipo_operazione, privacy_required, privacy_acknowledged, is_preventivo) FROM stdin;
1771333556925	2026-02-17 11:00:00+00	Eos Cooperativa Sociale	{"id": "508412", "cap": "31033", "nome": "Eos Cooperativa Sociale", "email": "info@eoscooperativa.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "CASTELFRANCO VENETO", "telefono": "3402249187", "indirizzo": "VIA OSPEDALE, 10", "provincia": "TV", "searchText": "eos cooperativa sociale castelfranco veneto ", "telefonoOriginale": "3402249187"}	3402249187	Simone	[]	[{"id": 1771333442068, "nome": "Stihl bobina filo tondo 2,7 MT 208 art. 0000 930 2227", "prezzo": 29.28, "quantita": 51, "matricola": null, "aliquotaIva": 22}]	0	\N	\N	Consegnare e ritirare 36 bobine filo 2,7 347 MT art. 0000 930 2289 per cambio articolo	fattura	completed	2026-02-17 11:00:00+00	t	user_1769961017929	cambio	f	f	f
1772470754631	2026-03-02 16:59:14.321+00	Edil Demi Di Covassin Demido	{"id": "502529", "cap": "31048", "nome": "Edil Demi Di Covassin Demido", "email": "edil-demi@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3482652180", "indirizzo": "VIA POSTUMIA CENTRO , 16/A", "provincia": "TV", "searchText": "edil demi di covassin demido san biagio di callalta ", "telefonoOriginale": "3482652180"}	3482652180	Simone	[{"brand": "STIHL", "model": "Troncatrice TS 910.0i, 400mm/16\\"", "prezzo": 1980, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "196978666"}]	[{"id": 1772470732908, "nome": "Motomix 5 litri", "prezzo": 27, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	2007	\N	\N	\N	fattura	completed	2026-03-02 16:59:14.321+00	t	user_1769961017929	vendita	f	f	f
1772698454042	2026-03-05 08:14:14.042+00	Visentin Roberto	{"id": "509469", "cap": "31030", "nome": "Visentin Roberto", "email": "spazzioverde1@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "BREDA DI PIAVE", "telefono": "3467443956", "indirizzo": "VIA ANGELA VERONESE, 22", "provincia": "TV", "searchText": "visentin roberto breda di piave ", "telefonoOriginale": "3467443956"}	3467443956	Simone	[]	[{"id": 1772698447121, "nome": "Strong 10 kg", "prezzo": 81.5, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	81.5	\N	\N	\N	scontrino	completed	2026-03-05 08:14:14.042+00	t	user_1770584612559	vendita	f	f	f
1772810660020	2026-03-06 15:24:20.02+00	Gemma Verde Loriano De Biasi	{"id": "509792", "cap": "31038", "nome": "Gemma Verde Loriano De Biasi", "email": "de.biasi.loriano@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3402878608", "indirizzo": "VIA P. MALVESTITI 10 - POSTIOMA", "provincia": "TV", "searchText": "gemma verde loriano de biasi paese ", "telefonoOriginale": "3402878608"}	3402878608	Simone	[]	[{"id": 1772810629122, "nome": "Green 7 25 kg", "prezzo": 43, "quantita": 2, "matricola": null, "aliquotaIva": 4}]	86	\N	\N	\N	scontrino	completed	2026-03-06 15:24:20.02+00	f	user_1772789533838	vendita	f	f	f
1773050032197	2026-03-09 11:00:00+00	Battistel Denis	{"cf": null, "id": "aab0f8c6-cd23-40a0-bb56-3d2137d0591a", "cap": "31048", "sdi": null, "nome": "Battistel Denis", "piva": null, "email": "battisteldenis@gmail.com", "nomeP": "Battistel Denis", "localita": "San Biagio di Callalta", "telefono": "3280864412", "indirizzo": "Via Francescata 6", "provincia": "TV", "searchText": "Battistel Denis"}	3280864412	Simone	[]	[{"id": 1773050023366, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 2, "matricola": null, "aliquotaIva": 4}, {"id": 1773050391718, "nome": "HURRICANE KG 5", "prezzo": 54.45, "quantita": 1}]	149.85	\N	\N	\N	scontrino	completed	2026-03-09 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1772193413182	2026-02-27 11:56:52.399+00	Habitat Natura Di Simone Taffarello	{"id": "201214", "cap": "31048", "nome": "Habitat Natura Di Simone Taffarello", "email": "info@habitatnatura.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "335312402", "indirizzo": "VIA SAN FLORIANO, 11/A - OLMI", "provincia": "TV", "searchText": "habitat natura di simone taffarello san biagio di callalta ", "telefonoOriginale": "335312402"}	335312402	Simone	[{"brand": "Volpi", "model": "Decespugliatore Ciao", "prezzo": 36, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PP4624.359NB"}]	[]	36	\N	\N	\N	scontrino	completed	2026-02-27 11:56:52.399+00	f	user_1769961017929	vendita	f	f	f
1772471899116	2026-03-02 17:18:18.951+00	Viviani Antonio	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega CS-280TES", "prezzo": 299, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "C75138079230"}]	[{"id": 1772471856132, "nome": "Marline 2 T 5 litri", "prezzo": 27, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1772471886378, "nome": "Olio catena Pro Up 2 litri", "prezzo": 11, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	337	\N	\N	\N	scontrino	completed	2026-03-02 17:18:18.951+00	t	user_1769961017929	vendita	f	f	f
1772699565277	2026-03-05 08:32:45.274+00	Fantuzzo Luca	\N	\N	Simone	[{"brand": "Honda", "model": "Trattorino HF2625 HME", "prezzo": 6199, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[]	6199	3000	pos	Consegna a domicilio appena pronto. Saldo con bonifico bancario	scontrino	pending	\N	t	user_1769961017929	vendita	f	f	f
1772814552841	2026-03-06 16:29:12.841+00	Lombardi Pietro	\N	\N	Simone	[{"brand": "Stocker", "model": "Irroratore Geyser Pro", "prezzo": 1590, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "2541572916785"}]	[{"id": 1772814456411, "nome": "Alimentatore", "prezzo": 124, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	1714	\N	\N	\N	fattura	completed	2026-03-06 16:29:53.647+00	t	user_1770584612559	vendita	f	f	f
1773052842702	2026-03-09 10:40:42.702+00	Gemma Verde Loriano De Biasi	{"id": "509792", "cap": "31038", "nome": "Gemma Verde Loriano De Biasi", "email": "de.biasi.loriano@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3402878608", "indirizzo": "VIA P. MALVESTITI 10 - POSTIOMA", "provincia": "TV", "searchText": "gemma verde loriano de biasi paese ", "telefonoOriginale": "3402878608"}	3402878608	Simone	[]	[{"id": 1773052836762, "nome": "Green 7 25 kg", "prezzo": 43, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	43	\N	\N	\N	scontrino	completed	2026-03-09 10:40:42.702+00	t	user_1773043211070	vendita	f	f	f
recovered-131	2026-01-28 11:00:00+00	Favero Giardini Di Favero Mirco	\N	\N	Simone	[]	[{"nome": "GANCIO TRAINO AVANT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	200	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone	vendita	f	f	f
recovered-130	2026-01-28 11:00:00+00	Haprilla Kola	\N	\N	Simone	[]	[{"nome": "Trattorino John Deere x 165 usato, visto e piaciuto nello stato in cui si trova", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	1350	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone	vendita	f	f	f
1772267744154	2026-02-28 08:35:43.824+00	Bergamo Nello - Impresa Edile	{"id": "202992", "cap": "31048", "nome": "Bergamo Nello - Impresa Edile", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "0422 897964", "indirizzo": "VIA G. GALILEI N. 19", "provincia": "TV", "searchText": "bergamo nello - impresa edile san biagio di callalta ", "telefonoOriginale": "0422 897964"}	0422 897964	Simone	[{"brand": "NEGRI", "model": "Biotrituratore R95BRAHP65", "prezzo": 1600, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "27489101"}]	[]	1600	\N	\N	\N	fattura	completed	2026-02-28 08:35:43.824+00	t	user_1769961017929	vendita	f	f	f
1772529500057	2026-03-03 09:18:18.637+00	Ortolan Sara	\N	\N	Simone	[{"brand": "STIHL", "model": "Tosaerba RMA 239.1", "prezzo": 309, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "451990095"}, {"brand": "STIHL", "model": "AL 101", "prezzo": 160, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "986413411"}, {"brand": "STIHL", "model": "AK 30.0S", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "912736954"}, {"brand": "STIHL", "model": "Tagliabordi FSA 50.0", "prezzo": 179, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "451521369"}, {"brand": "STIHL", "model": "Soffiatore BGA 50.0", "prezzo": 159, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452100454"}]	[]	807	\N	\N	\N	scontrino	completed	2026-03-03 09:18:18.637+00	f	user_1769961017929	vendita	f	f	f
1772706224154	2026-03-05 10:23:43.113+00	Tegon Sergio	{"id": "508520", "cap": "31048", "nome": "Tegon Sergio", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "0422790312", "indirizzo": "VIA GOITO, 7 - SANT'ANDREA D I BARBARANA", "provincia": "TV", "searchText": "tegon sergio san biagio di callalta ", "telefonoOriginale": "0422790312"}	0422790312	Simone	[{"brand": "Honda", "model": "Motozappa F220K1 GET2", "prezzo": 999, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "FAAJ-3620207"}]	[]	999	50	contanti	\N	scontrino	completed	2026-03-05 10:23:43.113+00	t	user_1769961017929	vendita	f	f	f
1772869167515	2026-03-07 07:39:27.513+00	Pegorer Mauro	{"id": "201639", "cap": "31057", "nome": "Pegorer Mauro", "email": "mauropegorer@virgilio.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "042294542", "indirizzo": "STRADA PROV. TREVISO MARE", "provincia": "TV", "searchText": "pegorer mauro silea ", "telefonoOriginale": "042294542"}	042294542	Simone	[]	[{"id": 1772869122905, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-07 07:39:27.513+00	f	user_1772867117490	vendita	f	f	f
recovered-165	2026-02-14 11:00:00+00	Osan Emil Augustin	\N	\N	Simone	[{"brand": "STIHL", "model": "Tagliasiepi HL 92 C-E", "prezzo": 790, "aliquotaIva": 22, "serialNumber": "542187474"}]	[]	790	\N	\N	\N	scontrino	completed	2026-02-14 11:00:00+00	t	Simone	vendita	f	f	f
recovered-143	2026-02-07 11:00:00+00	Menegaldo Bruno	\N	\N	Simone	[{"brand": "Stihl", "model": "MOTOSEGA STIHL MS 661", "prezzo": 1630, "aliquotaIva": 22, "serialNumber": "193 545 593"}]	[]	1630	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone	vendita	f	f	f
recovered-144	2026-02-07 11:00:00+00	XHELAJ REMZI	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "POTATORE KVS 8000", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "SL3325 371 NB"}, {"brand": "ACCESSORI", "model": "FORBICE KV 390", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "PZ 2925 390NB"}]	[{"nome": "1 CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	840	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone	vendita	f	f	f
recovered-145	2026-02-07 11:00:00+00	Xhelaj Kreshnik	\N	\N	Simone	[{"brand": "ECHO", "model": "Motosega CS 2511 TES", "prezzo": 439, "aliquotaIva": 22, "serialNumber": "C 74638144456"}]	[]	439	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone	vendita	f	f	f
recovered-140	2026-02-06 11:00:00+00	COMMISSATI FRANCESCA	\N	\N	Simone	[{"brand": "STIHL", "model": "BIOTRITURATORE GHE 105", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "451998874"}]	[{"nome": "Stihl POTATORE GTA 26 942966195", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AS 2 937201708", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATT. AL 1 718061245", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	609	\N	\N	\N	scontrino	completed	2026-02-06 11:00:00+00	t	Simone	vendita	f	f	f
recovered-141	2026-02-06 11:00:00+00	CARRARO PAOLO	\N	\N	Simone	[{"brand": "Stihl", "model": "Motosega MS 231", "prezzo": 539, "aliquotaIva": 22, "serialNumber": "194 053 082"}]	[]	539	\N	\N	\N	scontrino	completed	2026-02-06 11:00:00+00	t	Simone	vendita	f	f	f
recovered-142	2026-02-05 11:00:00+00	AZ. AGR. SEMPREVERDE DI TOFFOLI SONIA	\N	\N	Simone	[{"brand": "Stihl", "model": "TOSASIEPI HLA 135", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "449925313"}]	[{"nome": "CUFFIA OPTIME", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}, {"nome": "CUFFIA KRAMP", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	704.1	\N	\N	\N	scontrino	completed	2026-02-05 11:00:00+00	t	Simone	vendita	f	f	f
recovered-138	2026-02-02 11:00:00+00	MA.DI. GREEN di Diego Mardegan	\N	\N	Simone	[{"brand": "Stihl", "model": "TOSASIEPI HS82 R cm 75", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "197814730"}, {"brand": "Stihl", "model": "TOSASIEPI HSA140R cm 75", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "451286601"}]	[{"nome": "PALETTA MANUALE", "prezzo": 0, "quantita": 4, "aliquotaIva": 22}, {"nome": "MANICO ZM-V4", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}]	1677.14	\N	\N	\N	scontrino	completed	2026-02-02 11:00:00+00	t	Simone	vendita	f	f	f
recovered-162	2026-02-02 11:00:00+00	Bimetal	\N	\N	Simone	[]	[{"nome": "61 PMM3 Piccolo Micro Mini Catena", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}, {"nome": "catena m47-91", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CATENA 91 - 53M", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}, {"nome": "CATENA 1/4 1,1 52M", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}]	132.55	\N	\N	\N	scontrino	completed	2026-02-02 11:00:00+00	t	Simone	vendita	f	f	f
recovered-136	2026-01-30 11:00:00+00	Tonini Srl	\N	\N	Simone	[]	[{"nome": "Pantalone Echo antitaglio", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	95	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone	vendita	f	f	f
recovered-134	2026-01-30 11:00:00+00	Taffarello Daniele	\N	\N	Simone	[{"brand": "Volpi", "model": "POTATORE VOLPI KVS 7100P", "prezzo": 409, "aliquotaIva": 22, "serialNumber": "SRØ123 Ø773LS"}]	[]	409	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone	vendita	f	f	f
recovered-135	2026-01-30 11:00:00+00	Piovesan Andrea	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "Motosega MS 231", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "194053039"}]	[{"nome": "TANICA MOTOMIX 5 L", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	566.5	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone	vendita	f	f	f
recovered-132	2026-01-28 11:00:00+00	Vacilotto Valerio	\N	\N	Simone	[{"brand": "STIHL", "model": "FORBICE STIHL ASA 20", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "707610915"}]	[{"nome": "BATTERIA AS 2", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATT. AL 101", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	219	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone	vendita	f	f	f
recovered-133	2026-01-28 11:00:00+00	AZ. AGR. POSSAMAI GIULIANO e C.	\N	\N	Simone	[{"brand": "ECHO", "model": "MOTOSEGA DCS 2500 T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "T 91435039178"}]	[{"nome": "BATTERIA LBP 50-150", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATT. LCJQ-560", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	708	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone	vendita	f	f	f
recovered-128	2026-01-23 11:00:00+00	TONINI SRL	\N	\N	Simone	[{"brand": "Echo", "model": "MOTOSEGA CS 2511 TES", "prezzo": 439, "aliquotaIva": 22, "serialNumber": "C87940041531"}]	[]	439	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone	vendita	f	f	f
recovered-124	2026-01-20 11:00:00+00	CORTESE MIRCO	\N	\N	Simone	[]	[{"nome": "POTATORE HTA 50", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATTERIA AL 101", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AK2O", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	459	\N	\N	\N	scontrino	completed	2026-01-20 11:00:00+00	t	Simone	vendita	f	f	f
1772269324233	2026-02-28 09:02:04.233+00	M&A Saterini Snc	{"id": "512498", "cap": "31100", "nome": "M&A Saterini Snc", "email": "saterinisnc@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3341760622", "indirizzo": "VIA UGO FOSCOLO, 19", "provincia": "TV", "searchText": "m&a saterini snc treviso ", "telefonoOriginale": "3341760622"}	3341760622	Simone	[]	[{"id": 1772269310543, "nome": "Svettatoio RCM Wolf", "prezzo": 82, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	82	\N	\N	\N	fattura	completed	2026-02-28 09:02:04.233+00	t	user_1769961017929	vendita	f	f	f
1772530049616	2026-03-03 09:27:29.616+00	Habitat Natura Di Simone Taffarello	{"id": "201214", "cap": "31048", "nome": "Habitat Natura Di Simone Taffarello", "email": "info@habitatnatura.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "335312402", "indirizzo": "VIA SAN FLORIANO, 11/A - OLMI", "provincia": "TV", "searchText": "habitat natura di simone taffarello san biagio di callalta ", "telefonoOriginale": "335312402"}	335312402	Simone	[]	[{"id": 1772530032547, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-03 09:27:29.616+00	t	user_1772521427039	vendita	f	f	f
recovered-129	2026-01-26 11:00:00+00	PAOLO BARBON	\N	\N	Simone	[]	[{"nome": "WEIBANG TRINCIAERBA CARDANO 3 VELOCITA WBBC537SCV", "prezzo": 1350, "quantita": 1, "aliquotaIva": 22}]	1350	100	contanti	cell. 3464744611	scontrino	completed	2026-01-26 11:00:00+00	t	Simone	vendita	f	f	f
1772785776569	2026-03-06 08:29:36.569+00	Taffarello Giuliano	{"id": "504173", "cap": "31030", "nome": "Taffarello Giuliano", "email": "giuliano.taffarello@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3356947922", "indirizzo": "VIA GRANDE DI MIGNAGOLA, 73", "provincia": "TV", "searchText": "taffarello giuliano carbonera ", "telefonoOriginale": "3356947922"}	3356947922	Simone	[{"brand": "Segway", "model": "Robot tosaerba X430E", "prezzo": 3500, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[]	3500	500	pos	\N	scontrino	pending	\N	t	user_1770584612559	vendita	f	f	f
1772872572362	2026-03-07 08:36:11.624+00	Favaro Arnaldo	{"id": "512983", "cap": "31056", "nome": "Favaro Arnaldo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3391572851", "indirizzo": "VIA GALLI, 39/B", "provincia": "TV", "searchText": "favaro arnaldo roncade ", "telefonoOriginale": "3391572851"}	3391572851	Admin	[{"brand": "STIHL", "model": " MSA 70.0 C", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452200572"}, {"brand": "STIHL", "model": " AK 20", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "45204006535AE021G02910599504"}, {"brand": "STIHL", "model": " AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702287103"}]	[]	398	\N	\N	\N	scontrino	completed	2026-03-07 08:36:11.624+00	t	user_1772723709793	vendita	f	f	f
1773068231847	2026-03-09 11:00:00+00	vivai lovisetto marco	\N	\N	Simone	[]	[{"id": 1773068091299, "nome": "MOLLA A TAZZA 40 X20,4X0,5", "prezzo": 1.56, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091300, "nome": "PERNO LAMA FD", "prezzo": 7.95, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091301, "nome": "LAMA PIATTO CLS9/CLS10/TRINCIA", "prezzo": 16.8, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091302, "nome": "RONDELLA 35 X 12,5 X 6", "prezzo": 2.05, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091303, "nome": "DADO 12X1,75 AUTUBL BASSO", "prezzo": 0.33, "quantita": 2, "matricola": null, "aliquotaIva": 22}]	57.38	\N	\N	\N	fattura	completed	2026-03-09 11:00:00+00	f	user_1769961017929	vendita	f	f	f
recovered-126	2026-01-23 11:00:00+00	AZ. AGR. Moz Moreno	\N	\N	Simone	[]	[{"nome": "SET CINTURA ADVANCE X-FLEX N°4", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	98	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone	vendita	f	f	f
recovered-127	2026-01-23 11:00:00+00	Bortolato Alessandro	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "1 Motosega MS 182", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "837 262 464"}]	[{"nome": "1 Mix Marline 5LT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "1 Olio PRO-UP 2LT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	417	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone	vendita	f	f	f
recovered-125	2026-01-22 11:00:00+00	BIANCO DAVIDE	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega CS3410", "prezzo": 269, "aliquotaIva": 22, "serialNumber": "F09238003622"}]	[]	269	\N	\N	\N	scontrino	completed	2026-01-22 11:00:00+00	t	Simone	vendita	f	f	f
recovered-123	2026-01-19 11:00:00+00	Toffolo Alessandro	\N	\N	Simone	[]	[{"nome": "Pantalone Stihl Function", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	119	\N	\N	\N	scontrino	completed	2026-01-19 11:00:00+00	t	Simone	vendita	f	f	f
recovered-119	2026-01-17 11:00:00+00	Gardin Adriano	\N	\N	Simone	[{"brand": "VARIE", "model": "POTATORE VOLPI KVS 8000", "prezzo": 220, "aliquotaIva": 22, "serialNumber": "SL 2025.165NB"}]	[]	220	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone	vendita	f	f	f
recovered-120	2026-01-17 11:00:00+00	WALTER RIZZATO	\N	\N	Simone	[{"brand": "STIHL", "model": "MOTOSGA MS 182", "prezzo": 379, "aliquotaIva": 22, "serialNumber": "837 262 267"}]	[]	379	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone	vendita	f	f	f
recovered-122	2026-01-17 11:00:00+00	Fossaluzza Sandro	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "MOTOSEGA MS 194 T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "547317805"}]	[{"nome": "CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	359	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone	vendita	f	f	f
recovered-121	2026-01-17 11:00:00+00	CARNIEL MARCO	\N	\N	Simone	[]	[{"nome": "IMPIANTO ANTIZANZARE GEYSER PRO, 43 UGELLI", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	2350	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone	vendita	f	f	f
recovered-118	2026-01-16 11:00:00+00	Moretti Marco	\N	\N	Simone	[{"brand": "VARIE", "model": "MOTOSEGA MSA 161 T", "prezzo": 425, "aliquotaIva": 22, "serialNumber": "451890971"}]	[]	425	\N	\N	\N	scontrino	completed	2026-01-16 11:00:00+00	t	Simone	vendita	f	f	f
1772269630211	2026-02-28 09:07:10.21+00	Gobbo Pietro	\N	\N	Simone	[]	[{"id": 1772269574702, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1772269588707, "nome": "Albatros Vigor Active Kg 25 25 kg", "prezzo": 53.1, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	100.8	\N	\N	\N	scontrino	completed	2026-02-28 09:07:10.21+00	t	user_1769961017929	vendita	f	f	f
recovered-114	2026-01-16 11:00:00+00	AZ. AGR. La Quercia Di Dal Ben Igor	\N	\N	Simone	[]	[{"nome": "CATENE 52 MAGLIE 1,1 mm", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}, {"nome": "BIOPLUS 20 LITRI", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "HP ULTRA LT 5", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	203.8	\N	\N	\N	scontrino	completed	2026-01-16 11:00:00+00	t	Simone	vendita	f	f	f
recovered-112	2026-01-14 11:00:00+00	Zanardo Fabio	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "ECHO MOTOSEGA CS 2511 TES", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "C87940041634"}]	[{"nome": "FORBICE", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	488	\N	\N	\N	scontrino	completed	2026-01-14 11:00:00+00	t	Simone	vendita	f	f	f
recovered-113	2026-01-14 11:00:00+00	GRACIS PAOLO VIA C. BATTIISTI 47/A VOLPAGO	\N	\N	Simone	[]	[{"nome": "SPACCALEGNA SUG 700 7 TONN.", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	860	\N	\N	\N	scontrino	completed	2026-01-14 11:00:00+00	t	Simone	vendita	f	f	f
recovered-108	2026-01-12 11:00:00+00	Green Style Srl	\N	\N	Simone	[{"brand": "VARIE", "model": "Tosasiepi Stihl HLA 66", "prezzo": 405, "aliquotaIva": 22, "serialNumber": "452306770"}]	[]	405	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone	vendita	f	f	f
recovered-110	2026-01-12 11:00:00+00	MORO ENRICO	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega ECHO DCS 2500T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "C 81535021918"}]	[{"nome": "BATTERIA LBP 56V 125  E83935013630", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATT. LCJQ 560C  T91435038990 KIT ENERGIA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	708	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone	vendita	f	f	f
recovered-111	2026-01-12 11:00:00+00	IFAF SPA VIA CALNOVA 105 30020 NOVENTA DIP.	\N	\N	Simone	[]	[{"nome": "SNOWEX SPARGISALS SNOWEX", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "VEE PRO 6000", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	7900	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone	vendita	f	f	f
recovered-116	2026-01-10 11:00:00+00	ROSSI GIANCARLO VIA CARBONCINE 76 BIANCADE	\N	\N	Simone	[{"brand": "WEIBANG", "model": "TRINCIAERBA WEIBANG 3. VEL. WBBC 532 SCV", "prezzo": 1350, "aliquotaIva": 22, "serialNumber": "WBC537SCV/S021B&250103036"}]	[]	1350	\N	\N	\N	scontrino	completed	2026-01-10 11:00:00+00	t	Simone	vendita	f	f	f
recovered-115	2026-01-09 11:00:00+00	De Zottis sas	\N	\N	Simone	[]	[{"nome": "SOFFIATORE BGA 60 452325465", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AK30 912721072", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATTERIE AL 101 702817745", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	369	\N	\N	\N	scontrino	completed	2026-01-09 11:00:00+00	t	Simone	vendita	f	f	f
recovered-105	2026-01-09 11:00:00+00	MICHELE GOLFETTO	\N	\N	Simone	[]	[{"nome": "TRONCARAMI RS 750", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}]	134	\N	\N	\N	scontrino	completed	2026-01-09 11:00:00+00	t	Simone	vendita	f	f	f
recovered-104	2026-01-07 11:00:00+00	Battistel Thomas	\N	\N	Simone	[{"brand": "STIHL", "model": "SOFFIATORI BGA 160", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "450906088"}]	[{"nome": "SPRAY SUPERCLEAN", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	360	\N	\N	\N	scontrino	completed	2026-01-07 11:00:00+00	t	Simone	vendita	f	f	f
recovered-87	2026-01-07 11:00:00+00	MIOTTO BENIAMINO	\N	\N	Simone	[]	[{"nome": "SEGACCIO ARS 470mm", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "MANICO TELES. EXP 5.5", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	190	\N	\N	\N	scontrino	completed	2026-01-07 11:00:00+00	t	Simone	vendita	f	f	f
1772270715735	2026-02-28 09:25:15.284+00	Dal Corso Cristian via Massiego 13/A Casale sul Sile 3498450743 cristian.dalcorso@gmail.com	\N	\N	Simone	[{"brand": "Honda", "model": "Tosaerba HRG466C1 SKEP", "prezzo": 669, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MCCF1301493"}]	[]	669	\N	\N	\N	scontrino	completed	2026-02-28 09:25:15.284+00	t	user_1769961017929	vendita	f	f	f
1772531425040	2026-03-03 09:50:25.04+00	Uliana Giovanni	{"id": "511193", "cap": "31100", "nome": "Uliana Giovanni", "email": "uligio.uliana@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3515565939", "indirizzo": "VIALE TRENTO TRIESTE, 10/A", "provincia": "TV", "searchText": "uliana giovanni treviso ", "telefonoOriginale": "3515565939"}	3515565939	Simone	[{"brand": "Weibang", "model": "Tosaerba WBC537SCV", "prezzo": 1425, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "WBC537SCV/S021B&251212012"}]	[]	1425	425	contanti	\N	scontrino	completed	2026-03-05 12:54:46.828+00	t	user_1769961017929	vendita	f	f	f
1771139919865	2026-02-14 11:00:00+00	Piovesan Andrea	{"id": "513052", "cap": "31050", "nome": "Piovesan Andrea", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "MONASTIER DI TREVISO", "telefono": "3202725545", "indirizzo": "VIA PAVANI, 37A", "provincia": "TV", "searchText": "piovesan andrea monastier di treviso ", "telefonoOriginale": "3202725545"}	3202725545	Simone	[]	[{"id": 1771139908345, "nome": "Affilatore catena Stihl", "prezzo": 52, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	52	\N	\N	\N	scontrino	completed	2026-02-14 11:00:00+00	t	user_1770584612559	vendita	f	f	f
1772791614338	2026-03-06 10:06:54.338+00	Pasquali Silvano	{"id": "501948", "cap": "31048", "nome": "Pasquali Silvano", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3493238900", "indirizzo": "VIA SAN FRANCESCO, 28 -ROVARE'", "provincia": "TV", "searchText": "pasquali silvano san biagio di callalta ", "telefonoOriginale": "3493238900"}	3493238900	Simone	[]	[{"id": 1772791609911, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-06 10:06:54.338+00	t	user_1770584612559	vendita	f	f	f
1772872964693	2026-03-07 08:42:42.893+00	Caredi S.R.L.	{"id": "503694", "cap": "31057", "nome": "Caredi S.R.L.", "email": "info@caredi.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "042294073", "indirizzo": "VIA S. ELENA, 52", "provincia": "TV", "searchText": "caredi s.r.l. silea ", "telefonoOriginale": "042294073"}	042294073	Admin	[{"brand": "STIHL", "model": " HSA 60.1", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452246465"}, {"brand": "STIHL", "model": " AK 20", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "910695337"}, {"brand": "STIHL", "model": " AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702644370"}]	[]	390	\N	\N	\N	fattura	completed	2026-03-07 08:42:42.893+00	t	user_1772723709793	vendita	f	f	f
1773069322800	2026-03-09 15:15:22.799+00	Bresolin Andrea	{"id": "511309", "cap": "31034", "nome": "Bresolin Andrea", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "CAVASO DEL TOMBA", "telefono": "", "indirizzo": "VIA SAN PIO X 197 I 5", "provincia": "TV", "searchText": "bresolin andrea cavaso del tomba ", "telefonoOriginale": ""}	\N	Simone	[]	[{"id": 1773069220485, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 2, "matricola": null, "aliquotaIva": 10}, {"id": 1773069249381, "nome": "AllRound 20 kg", "prezzo": 58.3, "quantita": 5, "matricola": null, "aliquotaIva": 4}, {"id": 1773069296739, "nome": "Albatros Vigor Active Kg 25 kg", "prezzo": 47.9, "quantita": 2, "matricola": null, "aliquotaIva": 4}]	595.3	\N	\N	\N	fattura	completed	2026-03-09 15:15:22.799+00	t	user_1769961017929	vendita	f	f	f
1770385464630	2026-02-06 13:44:24.631+00	AZ. AGR. Moz Moreno	{"id": "510801", "cap": "30100", "nome": "AZ. AGR. Moz Moreno", "email": "fattoriaimpronta@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "VENEZIA", "telefono": "3408032699", "indirizzo": "VIA PASSO CAMPALTO, 15A - CAMPALTO", "provincia": "VE", "searchText": "az. agr. moz moreno venezia ", "telefonoOriginale": "3408032699"}	3408032699	Simone	[]	[{"id": 1770385435974, "nome": "Zaino supporto tosasiepi", "prezzo": 400, "quantita": 1, "descrizione": "ZAINO SUPPORTO TOSASIEPI"}]	400	\N	\N	I.C.	fattura	completed	2026-02-06 13:44:24.631+00	t	user_1769961017929	vendita	f	f	f
1772274248500	2026-02-28 10:24:07.909+00	Buscato Mattia via Ca' Memo 29 Noventa di Piave 340 4519357 mbuschy04@gmail.com	\N	\N	Simone	[{"brand": "Honda", "model": "Tosaerba HRN536C2 VYEH", "prezzo": 959, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MCSF1028729"}]	[]	959	\N	\N	\N	scontrino	completed	2026-02-28 10:24:07.909+00	t	user_1769961017929	vendita	f	f	f
1770626009165	2026-02-09 08:33:29.165+00	Moretti Marco	{"id": "202904", "cap": "31100", "nome": "Moretti Marco", "email": "moretti72.marco@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3392050119", "indirizzo": "VIA TIMAVO", "provincia": "TV", "searchText": "moretti marco treviso ", "telefonoOriginale": "3392050119"}	3392050119	Simone	[{"brand": "", "model": "MOTOSEGA MSA 161 T", "prezzo": 425, "isOmaggio": false, "serialNumber": "451890971"}]	[]	425	\N	\N	\N	fattura	completed	2026-02-09 08:33:29.165+00	t	user_1769961017929	vendita	f	f	f
1770744173693	2026-02-10 17:22:53.693+00	Camarotto Michele	{"id": "502091", "cap": "30020", "nome": "Camarotto Michele", "email": "saradilegui@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "FOSSALTA DI PIAVE", "telefono": "3484460983", "indirizzo": "VIA PASSO LAMPOL, 27/A", "provincia": "VE", "searchText": "camarotto michele fossalta di piave ", "telefonoOriginale": "3484460983"}	3484460983	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV295", "prezzo": 199, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "ZA1625.124NB"}]	[]	199	\N	\N	\N	scontrino	completed	2026-02-10 17:22:53.693+00	t	user_1769961017929	vendita	f	f	f
1770801828120	2026-02-11 09:23:48.12+00	Nico Giardini Di Bastarolo Nicola	{"id": "504139", "cap": "31059", "nome": "Nico Giardini Di Bastarolo Nicola", "email": "nickbast74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "ZERO BRANCO", "telefono": "3498200169", "indirizzo": "VIA G.B. GUIDINI, 29", "provincia": "TV", "searchText": "nico giardini di bastarolo nicola zero branco ", "telefonoOriginale": "3498200169"}	3498200169	Simone	[]	[{"id": 1770801600789, "nome": "Manicotti antitaglio ", "prezzo": 48, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801636352, "nome": "Ricambio Archman svettatoio ", "prezzo": 16, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801660760, "nome": "Visiera completa", "prezzo": 10, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801714594, "nome": "Cosciale copri pantaloni ", "prezzo": 17, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801775018, "nome": "Filo dice 3 mm 50 metri quadro R304342", "prezzo": 13.9, "quantita": 3, "matricola": null, "aliquotaIva": 22}, {"id": 1770801796561, "nome": "Svettatoio Archman ", "prezzo": 120, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	252.7	\N	\N	\N	fattura	completed	2026-02-11 09:23:48.12+00	t	user_1769961017929	vendita	f	f	f
1770997818464	2026-02-13 15:50:18.464+00	Scomparin Pierino	{"id": "502251", "cap": "31057", "nome": "Scomparin Pierino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "3394191177", "indirizzo": "VIA BELVEDERE, 71", "provincia": "TV", "searchText": "scomparin pierino silea ", "telefonoOriginale": "3394191177"}	3394191177	Simone	[{"brand": "STIHL", "model": "Batteria AS2 (28 Wh)", "prezzo": 42, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "950420572"}]	[]	42	\N	\N	\N	scontrino	completed	2026-02-13 15:50:18.464+00	t	user_1769961017929	vendita	f	f	f
1772791840067	2026-03-06 10:10:40.067+00	Torresan Silvano	{"id": "504548", "cap": "31050", "nome": "Torresan Silvano", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "MONASTIER DI TREVISO", "telefono": "3280309741", "indirizzo": "VIA EMILIA, 24", "provincia": "TV", "searchText": "torresan silvano monastier di treviso ", "telefonoOriginale": "3280309741"}	3280309741	Simone	[{"brand": "Stiga", "model": "Trattorino Rider usato con cambio manuale e piatto da 72 cm", "prezzo": 1100, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "usato giallo"}]	[]	1100	\N	\N	Preparare e chiamare per consegna appena pronto	scontrino	completed	2026-03-06 10:11:09.298+00	t	user_1770584612559	vendita	f	f	f
1771231859301	2026-02-16 11:00:00+00	Bisetto Mario	{"id": "502153", "cap": "31030", "nome": "Bisetto Mario", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3493730882", "indirizzo": "VIA CODALUNGA, 135", "provincia": "TV", "searchText": "bisetto mario carbonera ", "telefonoOriginale": "3493730882"}	3493730882	Simone	[{"brand": "STIHL", "model": "Decespugliatore FSA 80 R", "prezzo": 509, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "546519977"}, {"brand": "STIHL", "model": "Caricabatterie AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702817744"}, {"brand": "STIHL", "model": "Batteria AK 30.0S", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "912736933"}]	[]	509	\N	\N	\N	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1773044516572	2026-03-09 08:21:56.571+00	Piave Service Srl	{"id": "503141", "cap": "31030", "nome": "Piave Service Srl", "email": "piave-service@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "BREDA DI PIAVE", "telefono": "3488994157", "indirizzo": "VIA SAN GIACOMO, 5", "provincia": "TV", "searchText": "piave service srl breda di piave ", "telefonoOriginale": "3488994157"}	3488994157	Simone	[]	[{"id": 1773044495289, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 1, "matricola": null, "aliquotaIva": 10}, {"id": 1773044503779, "nome": "Hurricane (Sole+Ombra) 5 kg", "prezzo": 52, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	156	\N	\N	\N	fattura	completed	2026-03-09 08:21:56.571+00	t	user_1773043211070	vendita	f	f	f
1771258833161	2026-02-16 11:00:00+00	Balanza Marino	{"id": "509979", "cap": "31048", "nome": "Balanza Marino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3466323236", "indirizzo": "VIA CLAUDIA AUGUSTA, 6", "provincia": "TV", "searchText": "balanza marino san biagio di callalta ", "telefonoOriginale": "3466323236"}	3466323236	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV390", "prezzo": 459, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PZ2925.389NB"}, {"brand": "VOLPI", "model": "Potatore KVS6000", "prezzo": 200, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "SM4222498LS"}]	[{"id": 1771258823114, "nome": "Occhiali ", "prezzo": 5, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	664	\N	\N	Potatore senza batterie	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771492465151	2026-02-19 11:00:00+00	Sartori Luca	{"id": "203045", "cap": "31100", "nome": "Sartori Luca", "email": "sartoriluca74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3494968896", "indirizzo": "VIA S.ANTONINO 288", "provincia": "TV", "searchText": "sartori luca treviso ", "telefonoOriginale": "3494968896"}	3494968896	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310977"}]	[]	350	\N	\N	Pagamento BB fine mese	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771493646908	2026-02-19 11:00:00+00	Buffon Giancarlo	{"id": "512986", "cap": "31038", "nome": "Buffon Giancarlo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3496148085", "indirizzo": "VIA MARONCELLI 6", "provincia": "TV", "searchText": "buffon giancarlo paese ", "telefonoOriginale": "3496148085"}	3496148085	Simone	[{"brand": "STIHL", "model": "Tagliabordi FSA 30.0", "prezzo": 159, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "838110682"}, {"brand": "STIHL", "model": "Caricabatterie AL 1", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "935280185"}, {"brand": "STIHL", "model": "Batteria AS 2", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "937056842"}]	[{"id": 1771493623647, "nome": "Ricambio polycut", "prezzo": 4, "quantita": 2, "matricola": null, "aliquotaIva": 22}]	167	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	f	user_1769961017929	vendita	f	f	f
1771498408037	2026-02-19 11:00:00+00	AZ. AGR. Vivai Piante Di Dragancea Andrei	{"id": "202724", "cap": "31056", "nome": "AZ. AGR. Vivai Piante Di Dragancea Andrei", "email": "andrei.dragancea@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3282670287", "indirizzo": "VIA ARRIGO BOITO, 10 - BIANCADE", "provincia": "TV", "searchText": "az. agr. vivai piante di dragancea andrei roncade ", "telefonoOriginale": "3282670287"}	3282670287	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310979"}]	[]	350	\N	\N	\N	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771514517527	2026-02-19 11:00:00+00	Gasparini Francesco	{"id": "505627", "cap": "30020", "nome": "Gasparini Francesco", "email": "gasparini.francesco@virgilio.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "MEOLO", "telefono": "3939936820", "indirizzo": "VIA CA' CORNER SUD, 49", "provincia": "VE", "searchText": "gasparini francesco meolo ", "telefonoOriginale": "3939936820"}	3939936820	Simone	[{"brand": "Stihl", "model": "Atomizzatore SR 430 Mistblower", "prezzo": 760, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "370193762"}]	[]	760	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771667848261	2026-02-21 11:00:00+00	Cadorin Roberto	{"id": "514044", "cap": "31056", "nome": "Cadorin Roberto", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3479715095", "indirizzo": "VIA PARIS BORDONE, 39 - BIANCADE", "provincia": "TV", "searchText": "cadorin roberto roncade ", "telefonoOriginale": "3479715095"}	3479715095	Simone	[]	[{"id": 1771667799331, "nome": "CONCIME GREEN 7", "prezzo": 45.3, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	45.3	\N	\N	\N	scontrino	completed	2026-02-21 11:00:00+00	t	user_1771659500533	vendita	f	f	f
1771596591121	2026-02-20 14:09:50.604+00	Bonetto Franco	{"id": "511303", "cap": "31048", "nome": "Bonetto Franco", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3452383445", "indirizzo": "VIA ORTIGARA, 7 - FAGARE'", "provincia": "TV", "searchText": "bonetto franco san biagio di callalta ", "telefonoOriginale": "3452383445"}	3452383445	Simone	[{"brand": "VOLPI", "model": "Potatore KVS8000", "prezzo": 370, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "SL3325.372NB"}]	[]	370	\N	\N	\N	scontrino	completed	2026-02-20 14:09:50.604+00	t	user_1769961017929	vendita	f	f	f
1771664967655	2026-02-21 09:09:27.655+00	D'AMELIO Vincenzo	{"id": "502893", "cap": "31056", "nome": "D'AMELIO Vincenzo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3450818865", "indirizzo": "VIA PRINCIPE, 85/A - MUSESTRE", "provincia": "TV", "searchText": "d'amelio vincenzo roncade ", "telefonoOriginale": "3450818865"}	3450818865	Simone	[{"brand": "GGP", "model": "Trattorino XF 135 HD", "prezzo": 2200, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[]	2200	400	pos	Contattare il cliente appena pronto per la consegna. Ritirare rider del cliente per rottamazione	scontrino	pending	\N	t	user_1770584612559	vendita	f	f	f
1771670427449	2026-02-21 10:40:26.358+00	Chiericati Massimo	{"id": "505901", "cap": "31100", "nome": "Chiericati Massimo", "email": "", "nomeP": "", "cognome": "", "contatto": "Fronte Hotel Carletto", "localita": "TREVISO", "telefono": "3407860739", "indirizzo": "VIA SEBASTIANO CABOTO, 13 - SELVANA", "provincia": "TV", "searchText": "chiericati massimo treviso fronte hotel carletto", "telefonoOriginale": "3407860739"}	3407860739	Simone	[{"brand": "STIHL", "model": "Motosega MS 194 T 1/4 P Chainsaw", "prezzo": 349, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "540455888"}]	[{"id": 1771670392224, "nome": "Olio catena bioplus 1 litro", "prezzo": 6, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1771670408727, "nome": "Guanti ", "prezzo": 3.9, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	358.9	\N	\N	\N	scontrino	completed	2026-02-21 10:40:26.358+00	t	user_1769961017929	vendita	f	f	f
1772276586896	2026-02-28 11:03:06.587+00	Patruno Franco	{"id": "506125", "cap": "31048", "nome": "Patruno Franco", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3935553311", "indirizzo": "VIA TREVISO MARE, 8", "provincia": "TV", "searchText": "patruno franco san biagio di callalta ", "telefonoOriginale": "3935553311"}	3935553311	Simone	[{"brand": "STIHL", "model": "Decespugliatore FSA 60 R", "prezzo": 185, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "450921356"}]	[]	185	\N	\N	\N	scontrino	completed	2026-02-28 11:03:06.587+00	t	user_1769961017929	vendita	f	f	f
1771836731318	2026-02-23 08:52:11.318+00	Mareverde Srls	{"id": "501758", "cap": "30016", "nome": "Mareverde Srls", "email": "info@vivaisorgon.it", "nomeP": "", "cognome": "", "contatto": "Simone 335490390", "localita": "JESOLO", "telefono": "0421230013", "indirizzo": "Via Zuccarini, 11", "provincia": "VE", "searchText": "mareverde srls jesolo simone 335490390", "telefonoOriginale": "0421230013"}	0421230013	Simone	[{"brand": "Grillo", "model": "Trattorino FD500", "prezzo": 22326, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[{"id": 1771836586694, "nome": "Ritiro Vs trattorino usato GF PG280D", "prezzo": -14640, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	7686	1300	bonifico	consegna a febbraio (il cliente è stato avvisato che la consegna sarà spostata a marzo). Pagamento con ricevuta bancaria a 30-60 giorni	scontrino	pending	\N	t	user_1770584612559	vendita	f	f	f
1772698023760	2026-03-05 08:07:03.759+00	La Gemma Di Bianchin Mauro & C. Snc	{"id": "202369", "cap": "31049", "nome": "La Gemma Di Bianchin Mauro & C. Snc", "email": "info@gemmagiardini.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "VALDOBBIADENE", "telefono": "0423981412", "indirizzo": "STRADA ROSA 44 - BIGOLINO", "provincia": "TV", "searchText": "la gemma di bianchin mauro & c. snc valdobbiadene ", "telefonoOriginale": "0423981412"}	0423981412	Simone	[]	[{"id": 1772697630789, "nome": "Universal Top 20 kg", "prezzo": 56.5, "quantita": 4, "matricola": null, "aliquotaIva": 4}, {"id": 1772697650836, "nome": "Humifitos 25 Kg 25 kg", "prezzo": 103, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1772697668935, "nome": "Micosat F MO 5 kg", "prezzo": 140.4, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1772697688240, "nome": "Strong 10 kg", "prezzo": 81.5, "quantita": 1, "matricola": null, "aliquotaIva": 10}, {"id": 1772697704749, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	654.9	\N	\N	\N	fattura	completed	2026-03-05 08:07:03.759+00	t	user_1770584612559	vendita	f	f	f
1771857311156	2026-02-23 14:35:10.084+00	Cenedese Andrea	{"id": "500594", "cap": "31048", "nome": "Cenedese Andrea", "email": "andrea.cenedese@alice.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3318200684", "indirizzo": "VIA SAN MARTINO, 54 - SAN MARTINO", "provincia": "TV", "searchText": "cenedese andrea san biagio di callalta ", "telefonoOriginale": "3318200684"}	3318200684	Simone	[{"brand": "Volpi", "model": "Forbice elettronica KV360", "prezzo": 299, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PP4624.359NB"}]	[]	299	\N	\N	\N	scontrino	completed	2026-02-23 14:35:10.084+00	t	user_1769961017929	vendita	f	f	f
1771837124604	2026-02-23 11:00:00+00	COOP. Sociale Idee Verdi	{"id": "501441", "cap": "35030", "nome": "COOP. Sociale Idee Verdi", "email": "areacontabile@ideeverdi.it", "nomeP": "", "cognome": "", "contatto": "CEL. Marco Neve", "localita": "SELVAZZANO DENTRO", "telefono": "3450914123", "indirizzo": "VIA GALVANI, 16", "provincia": "PD", "searchText": "coop. sociale idee verdi selvazzano dentro cel. marco neve", "telefonoOriginale": "3450914123"}	3450914123	Simone	[{"brand": "Altro", "model": "Trattorino Ferris ISX 3300", "prezzo": 20740, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[{"id": 1772079631434, "nome": "Kit lame di ricambio ad alto lancio", "prezzo": 0, "quantita": 1}]	20740	1830	bonifico	\N	fattura	pending	\N	t	user_1770584612559	vendita	f	f	f
1772794749226	2026-03-06 10:59:07.036+00	Jesolo Gest Arl	{"id": "504127", "cap": "30016", "nome": "Jesolo Gest Arl", "email": "simone.v@clubdelsole.com,", "nomeP": "", "cognome": "", "contatto": "CEL1 Dorin -049656070", "localita": "JESOLO", "telefono": "3299278952", "indirizzo": "VIALE ORIENTE, 144", "provincia": "VE", "searchText": "jesolo gest arl jesolo cel1 dorin -049656070", "telefonoOriginale": "3299278952"}	3299278952	Simone	[{"brand": "STIHL", "model": "Potatore HTA 86", "prezzo": 530, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "449457136"}, {"brand": "STIHL", "model": "Batteria AP 500 S", "prezzo": 344.27, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "548989613"}, {"brand": "STIHL", "model": "Batteria AP 500 S", "prezzo": 344.27, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "548989674"}, {"brand": "STIHL", "model": "Batteria AP 300.0 S (281 Wh)", "prezzo": 269.67, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "921008377"}, {"brand": "STIHL", "model": "Batteria AP 300.0 S", "prezzo": 269.67, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "920001603"}]	[{"id": 1772794630440, "nome": "Testina Polycut Stihl 28-2", "prezzo": 21, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1772794675699, "nome": "Testina Autocut 27-2", "prezzo": 14.1, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	1792.98	\N	\N	\N	fattura	completed	2026-03-06 10:59:07.036+00	f	user_1769961017929	vendita	f	f	f
1773045271126	2026-03-09 11:00:00+00	BARBON IVAN	\N	\N	Simone	[]	[{"id": 1773045119753, "nome": "Universal Top 20 kg", "prezzo": 59.4, "quantita": 11, "matricola": null, "aliquotaIva": 4}]	653.4	\N	\N	\N	scontrino	completed	2026-03-09 11:00:00+00	t	user_1773043211070	vendita	f	f	f
1773075750834	2026-03-09 17:02:30.833+00	BROLLO MARCO	{"cf": null, "id": "a0f77d7b-6122-46c8-afb6-ce56c6356b80", "cap": "31048", "sdi": null, "nome": "BROLLO MARCO", "piva": null, "email": null, "nomeP": "BROLLO MARCO", "localita": "SAN BIAGIO DI CALLALTA", "telefono": null, "indirizzo": "VIA FRIULI", "provincia": null, "searchText": "BROLLO MARCO"}	\N	Simone	[]	[{"id": 1773075593716, "nome": "Eden 7 5 kg", "prezzo": 15.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1773075700238, "nome": "Micosat F prati & giardini 1 kg", "prezzo": 31.2, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	46.9	\N	\N	\N	scontrino	completed	2026-03-09 17:02:30.833+00	t	user_1773043211070	vendita	f	f	f
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory (id, "timestamp", action, brand, model, "serialNumber", cliente, prezzo, totale, status, "user", location, carico_automatico) FROM stdin;
178	2026-02-16 08:50:59.119+00	SCARICO	STIHL	Batteria AK 30.0S	912736933	Bisetto Mario	0	0	sold	user_1769961017929	main	f
177	2026-02-16 08:50:58.969+00	SCARICO	STIHL	Caricabatterie AL 101	702817744	Bisetto Mario	0	0	sold	user_1769961017929	main	f
183	2026-02-19 09:12:21.296+00	CARICO	STIHL	Motosega MSA 190.0 T	452310977	\N	\N	\N	available	user_1769961017929	main	f
188	2026-02-19 09:34:06.327+00	SCARICO	STIHL	Tagliabordi FSA 30.0	838110682	Buffon Giancarlo	0	0	sold	user_1769961017929	main	f
193	2026-02-19 10:53:27.211+00	SCARICO	STIHL	Motosega MSA 190.0 T	452310979	AZ. AGR. Vivai Piante Di Dragancea Andrei	0	0	sold	user_1769961017929	main	f
200	2026-02-21 10:36:10.272+00	CARICO	STIHL	Motosega MS 194 T 1/4 P Chainsaw	540455888	\N	\N	\N	available	user_1769961017929	main	f
209	2026-02-23 14:35:10.086+00	SCARICO	Volpi	Forbice elettronica KV360	PP4624.359NB	Cenedese Andrea	0	0	sold	user_1769961017929	main	f
212	2026-02-27 11:56:52.4+00	SCARICO	Volpi	Decespugliatore Ciao	PP4624.359NB	Habitat Natura Di Simone Taffarello	0	0	sold	user_1769961017929	main	f
215	2026-02-28 08:35:43.824+00	SCARICO	NEGRI	Biotrituratore R95BRAHP65	27489101	Bergamo Nello - Impresa Edile	0	0	sold	user_1769961017929	main	f
218	2026-02-28 10:23:34.259+00	CARICO	Honda	Tosaerba HRN536C2 VYEH	MCSF1028729	\N	\N	\N	available	user_1769961017929	main	t
222	2026-03-02 16:56:25.432+00	CARICO	STIHL	Troncatrice TS 910.0i, 400mm/16"	196978666	\N	\N	\N	available	user_1769961017929	main	t
225	2026-03-02 17:18:18.951+00	SCARICO	Echo	Motosega CS-280TES	C75138079230	Viviani Antonio	0	0	sold	user_1769961017929	main	f
108	2026-01-12 11:00:00+00	VENDITA	VARIE	Tosasiepi Stihl HLA 66 (SN: 452306770)	NOMAT-1770550419458	Green Style Srl	405	405	sold	Simone	main	f
111	2026-01-12 11:00:00+00	VENDITA	SNOWEX	SNOWEX SPARGISALS SNOWEX + VEE PRO 6000	NOMAT-1770589476407	IFAF SPA VIA CALNOVA 105 30020 NOVENTA DIP.	7900	7900	sold	Simone	main	f
112	2026-01-14 11:00:00+00	VENDITA	ACCESSORI	ECHO MOTOSEGA CS 2511 TES (SN: C87940041634) + FORBICE  + CATENA	NOMAT-1770615936616	Zanardo Fabio	488	488	sold	Simone	main	f
113	2026-01-14 11:00:00+00	VENDITA	VARIE	SPACCALEGNA SUG 700 7 TONN.	NOMAT-1770616271153	GRACIS PAOLO VIA C. BATTIISTI 47/A VOLPAGO	860	860	sold	Simone	main	f
114	2026-01-16 11:00:00+00	VENDITA	ACCESSORI	CATENE 52 MAGLIE 1,1 mm x2 + BIOPLUS 20 LITRI + HP ULTRA LT 5	NOMAT-1770616937887	AZ. AGR. La Quercia Di Dal Ben Igor	203.8	203.8	sold	Simone	main	f
115	2026-01-09 11:00:00+00	VENDITA	ACCESSORI	SOFFIATORE BGA 60 452325465 + BATTERIA AK30 912721072 + CARICABATTERIE AL 101 702817745	NOMAT-1770617231010	De Zottis sas	369	369	sold	Simone	main	f
116	2026-01-10 11:00:00+00	VENDITA	WEIBANG	WEIBANG TRINCIAERBA WEIBANG 3. VEL. WBBC 532 SCV (SN: WBC537SCV/S021B&250103036)	NOMAT-1770617528321	ROSSI GIANCARLO VIA CARBONCINE 76 BIANCADE	1350	1350	sold	Simone	main	f
117	2026-01-16 11:00:00+00	VENDITA	STIHL	MSA 161 T	451890971	Moretti Marco	425	425	sold	Simone	main	f
119	2026-01-17 11:00:00+00	VENDITA	VARIE	POTATORE VOLPI KVS 8000 (SN: SL 2025.165NB)	NOMAT-1770626174900	Gardin Adriano	220	220	sold	Simone	main	f
121	2026-01-17 11:00:00+00	VENDITA	VARIE	IMPIANTO ANTIZANZARE GEYSER PRO, 43 UGELLI	NOMAT-1770626491337	CARNIEL MARCO	2350	2350	sold	Simone	main	f
122	2026-01-17 11:00:00+00	VENDITA	ACCESSORI	MOTOSEGA MS 194 T (SN: 547317805) + CATENA	NOMAT-1770626684538	Fossaluzza Sandro	359	359	sold	Simone	main	f
123	2026-01-19 11:00:00+00	VENDITA	ACCESSORI	Pantalone Stihl Function	NOMAT-1770626836963	Toffolo Alessandro	119	119	sold	Simone	main	f
126	2026-01-23 11:00:00+00	VENDITA	ACCESSORI	SET CINTURA ADVANCE X-FLEX N°4	NOMAT-1770627347884	AZ. AGR. Moz Moreno	98	98	sold	Simone	main	f
127	2026-01-23 11:00:00+00	VENDITA	ACCESSORI	1 Motosega MS 182 (SN: 837 262 464) + 1 Mix Marline 5LT + 1 Olio PRO-UP 2LT	NOMAT-1770627577462	Bortolato Alessandro	417	417	sold	Simone	main	f
59	2026-01-16 10:28:29.791+00	CARICO	STIHL	MSA 161 T	451890971	\N	\N	\N	available	user_1766825174502	main	f
131	2026-01-28 11:00:00+00	VENDITA	ACCESSORI	GANCIO TRAINO AVANT	NOMAT-1770628289583	Favero Giardini Di Favero Mirco	200	200	sold	Simone	main	f
134	2026-01-30 11:00:00+00	VENDITA	Volpi	Volpi POTATORE VOLPI KVS 7100P (SN: SRØ123 Ø773LS)	NOMAT-1770628839453	Taffarello Daniele	409	409	sold	Simone	main	f
136	2026-01-30 11:00:00+00	VENDITA	ACCESSORI	Pantalone Echo antitaglio	NOMAT-1770629102868	Tonini Srl	95	95	sold	Simone	main	f
138	2026-02-02 11:00:00+00	VENDITA	Stihl	Stihl TOSASIEPI HS82 R cm 75 (SN: 197814730) + Stihl TOSASIEPI HSA140R cm 75 (SN: 451286601) + PALETTA MANUALE x4 + MANICO ZM-V4 x3	NOMAT-1770629456775	MA.DI. GREEN di Diego Mardegan	1677.1399999999999	1677.14	sold	Simone	main	f
141	2026-02-06 11:00:00+00	VENDITA	Stihl	Stihl Motosega MS 231 (SN: 194 053 082)	NOMAT-1770629840641	CARRARO PAOLO	539	539	sold	Simone	main	f
104	2026-01-07 11:00:00+00	VENDITA	STIHL	STIHL SOFFIATORI BGA 160 (SN: 450906088) + SPRAY SUPERCLEAN	NOMAT-1770542601552	Battistel Thomas	360	360	sold	Simone	main	f
125	2026-01-22 11:00:00+00	VENDITA	Echo	Motosega CS3410 (SN: F09238003622)	NOMAT-1770627118231	BIANCO DAVIDE	269	269	sold	Simone	main	f
87	2026-01-07 11:00:00+00	VENDITA	ACCESSORI	SEGACCIO ARS 470mm + MANICO TELES. EXP 5.5	NOMAT-1770538424954	MIOTTO BENIAMINO	190	190	sold	Simone	main	f
133	2026-01-28 11:00:00+00	VENDITA	ECHO	MOTOSEGA DCS 2500 T (SN: T 91435039178) + BATTERIA LBP 50-150 + CARICA BATT. LCJQ-560	NOMAT-1770628732478	AZ. AGR. POSSAMAI GIULIANO e C.	708	708	sold	Simone	main	f
132	2026-01-28 11:00:00+00	VENDITA	STIHL	FORBICE STIHL ASA 20 (SN: 707610915) + BATTERIA AS 2 + CARICABATT. AL 101	NOMAT-1770628454115	Vacilotto Valerio	219	219	sold	Simone	main	f
128	2026-01-23 11:00:00+00	VENDITA	Echo	MOTOSEGA CS 2511 TES (SN: C87940041531)	NOMAT-1770627778411	TONINI SRL	439	439	sold	Simone	main	f
129	2026-01-26 11:00:00+00	VENDITA	weibang	TRINCIAERBA CARDANO 3 VELOCITA\nWBBC537SCV	NOMAT-1770628005264	PAOLO BARBON	1350	1350	sold	Simone	main	f
130	2026-01-28 11:00:00+00	VENDITA		Trattorino John Deere x 165 usato, visto e piaciuto nello stato in cui si trova	NOMAT-1770628179893	Haprilla Kola	1350	1350	sold	Simone	main	f
124	2026-01-20 11:00:00+00	VENDITA	Stihl	POTATORE HTA 50 + CARICA BATTERIA AL 101 + BATTERIA AK2O	NOMAT-1770626999774	CORTESE MIRCO	459	459	sold	Simone	main	f
120	2026-01-17 11:00:00+00	VENDITA	STIHL	MOTOSGA MS 182 (SN: 837 262 267)	NOMAT-1770626309484	WALTER RIZZATO	379	379	sold	Simone	main	f
135	2026-01-30 11:00:00+00	VENDITA	ACCESSORI	Motosega MS 231 (SN: 194053039) + TANICA MOTOMIX 5 L	NOMAT-1770628981076	Piovesan Andrea	566.5	566.5	sold	Simone	main	f
140	2026-02-06 11:00:00+00	VENDITA	STIHL	STIHL BIOTRITURATORE GHE 105 (SN: 451998874) + Stihl POTATORE GTA 26 942966195 + BATTERIA AS 2 937201708 + CARICABATT. AL 1 718061245	NOMAT-1770629736627	COMMISSATI FRANCESCA	609	609	sold	Simone	main	f
142	2026-02-05 11:00:00+00	VENDITA	Stihl	Stihl TOSASIEPI HLA 135 (SN: 449925313) + CUFFIA OPTIME x2 + CUFFIA KRAMP	NOMAT-1770630123643	AZ. AGR. SEMPREVERDE DI TOFFOLI SONIA	704.1	704.1	sold	Simone	main	f
173	2026-02-16 08:43:04.075+00	CARICO	STIHL	Decespugliatore FSA 80 R	546519977	\N	\N	\N	available	user_1769961017929	main	f
174	2026-02-16 08:43:04.075+00	CARICO	STIHL	Batteria AK 30.0S	912736933	\N	\N	\N	available	user_1769961017929	main	f
175	2026-02-16 08:43:04.075+00	CARICO	STIHL	Caricabatterie AL 101	702817744	\N	\N	\N	available	user_1769961017929	main	f
179	2026-02-16 16:17:05.943+00	CARICO	VOLPI	Forbice elettronica KV390	PZ2925.389NB	\N	\N	\N	available	user_1769961017929	main	f
180	2026-02-16 16:17:05.943+00	CARICO	VOLPI	Potatore KVS6000	SM4222498LS	\N	\N	\N	available	user_1769961017929	main	f
184	2026-02-19 09:14:24.352+00	SCARICO	STIHL	Motosega MSA 190.0 T	452310977	Sartori Luca	0	0	sold	user_1769961017929	main	f
189	2026-02-19 09:34:06.583+00	SCARICO	STIHL	Caricabatterie AL 1	935280185	Buffon Giancarlo	0	0	sold	user_1769961017929	main	f
190	2026-02-19 09:34:06.74+00	SCARICO	STIHL	Batteria AS 2	937056842	Buffon Giancarlo	0	0	sold	user_1769961017929	main	f
194	2026-02-19 15:20:42.325+00	CARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	\N	\N	\N	available	user_1769961017929	main	f
195	2026-02-19 15:20:43.639+00	CARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	\N	\N	\N	available	user_1769961017929	main	f
198	2026-02-20 14:08:39.828+00	CARICO	VOLPI	Potatore KVS8000	SL3325.372NB	\N	\N	\N	available	user_1769961017929	main	f
201	2026-02-21 10:40:26.358+00	SCARICO	STIHL	Motosega MS 194 T 1/4 P Chainsaw	540455888	Chiericati Massimo	0	0	sold	user_1769961017929	main	f
207	2026-02-22 21:29:42.07+00	SCARICO	STIHL	RM 248.3 T	451394256	Habitat Natura Di Simone Taffarello	0	0	sold	user_1770584612559	main	f
216	2026-02-28 09:24:39.344+00	CARICO	Honda	Tosaerba HRG466C1 SKEP	MCCF1301493	\N	\N	\N	available	user_1769961017929	main	t
219	2026-02-28 10:24:07.909+00	SCARICO	Honda	Tosaerba HRN536C2 VYEH	MCSF1028729	Buscato Mattia via Ca' Memo 29 Noventa di Piave 340 4519357 mbuschy04@gmail.com	0	0	sold	user_1769961017929	main	f
223	2026-03-02 16:59:14.322+00	SCARICO	STIHL	Troncatrice TS 910.0i, 400mm/16"	196978666	Edil Demi Di Covassin Demido	0	0	sold	user_1769961017929	main	f
226	2026-03-03 09:07:49.161+00	CARICO	STIHL	Tosaerba RMA 239.1	451990095	\N	\N	\N	available	user_1769961017929	main	t
229	2026-03-03 09:10:52.138+00	CARICO	STIHL	AL 101	986413411	\N	\N	\N	available	user_1769961017929	main	t
231	2026-03-03 09:14:44.295+00	CARICO	STIHL	Soffiatore BGA 50.0	452100454	\N	\N	\N	available	user_1769961017929	main	t
233	2026-03-03 09:18:19.503+00	SCARICO	STIHL	AL 101	986413411	Ortolan Sara	0	0	sold	user_1769961017929	main	f
235	2026-03-03 09:18:19.824+00	SCARICO	STIHL	Tagliabordi FSA 50.0	451521369	Ortolan Sara	0	0	sold	user_1769961017929	main	f
236	2026-03-03 09:18:19.94+00	SCARICO	STIHL	Soffiatore BGA 50.0	452100454	Ortolan Sara	0	0	sold	user_1769961017929	main	f
238	2026-03-03 10:57:14.928+00	SCARICO	Honda	HRX537C7 HZEH	1032246	Nardi Stefano	0	0	sold	user_1771954874726	main	f
240	2026-03-05 10:23:43.113+00	SCARICO	Honda	Motozappa F220K1 GET2	FAAJ-3620207	Tegon Sergio	0	0	sold	user_1769961017929	main	f
242	2026-03-06 10:11:09.298+00	SCARICO			usato giallo	Torresan Silvano	0	0	sold	user_1770584612559	main	f
244	2026-03-06 10:54:22.709+00	CARICO	STIHL	Batteria AP 500 S	548989613	\N	\N	\N	available	user_1769961017929	main	t
246	2026-03-06 10:55:34.991+00	CARICO	STIHL	Batteria AP 300.0 S (281 Wh)	921008377	\N	\N	\N	available	user_1769961017929	main	t
248	2026-03-06 10:59:07.037+00	SCARICO	STIHL	Potatore HTA 86	449457136	Jesolo Gest Arl	0	0	sold	user_1769961017929	main	f
250	2026-03-06 10:59:08.853+00	SCARICO	STIHL	Batteria AP 500 S	548989674	Jesolo Gest Arl	0	0	sold	user_1769961017929	main	f
252	2026-03-06 10:59:09.109+00	SCARICO	STIHL	Batteria AP 300.0 S	920001603	Jesolo Gest Arl	0	0	sold	user_1769961017929	main	f
256	2026-03-07 08:34:20.291+00	CARICO	STIHL	 AK 20	45204006535AE021G02910599504	\N	\N	\N	available	user_1772723709793	main	t
258	2026-03-07 08:36:11.625+00	SCARICO	STIHL	 MSA 70.0 C	452200572	Favaro Arnaldo	0	0	sold	user_1772723709793	main	f
260	2026-03-07 08:36:12.198+00	SCARICO	STIHL	 AL 101	702287103	Favaro Arnaldo	0	0	sold	user_1772723709793	main	f
261	2026-03-07 08:41:37.05+00	CARICO	STIHL	 HSA 60.1	452246465	\N	\N	\N	available	user_1772723709793	main	t
263	2026-03-07 08:42:03.281+00	CARICO	STIHL	 AL 101	702644370	\N	\N	\N	available	user_1772723709793	main	t
265	2026-03-07 08:42:44.048+00	SCARICO	STIHL	 AK 20	910695337	Caredi S.R.L.	0	0	sold	user_1772723709793	main	f
268	2026-03-09 13:15:27.098+00	CARICO	STIGA	Trattorino XD 150 HD	25KA3RON005639	\N	\N	\N	available	user_1772723709793	main	f
270	2026-03-09 13:17:44.217+00	CARICO	STIGA	Trattorino XF 135 HD	25KA3RON011398	\N	\N	\N	available	user_1772723709793	main	f
272	2026-03-09 13:18:27.916+00	CARICO	STIGA	Trattorino XD 150 HD	25LA3RON016463	\N	\N	\N	available	user_1772723709793	main	f
274	2026-03-09 13:21:25.667+00	CARICO	STIGA	Trattorino XD 150 HD	25KA3RON005635	\N	\N	\N	available	user_1772723709793	main	f
276	2026-03-09 13:22:38.873+00	CARICO	STIGA	Trattorino XDC 150 HD	25LA3RON017987	\N	\N	\N	available	user_1772723709793	main	f
143	2026-02-07 11:00:00+00	VENDITA	Stihl	Stihl MOTOSEGA STIHL MS 661 (SN: 193 545 593)	NOMAT-1770630223483	Menegaldo Bruno	1630	1630	sold	Simone	main	f
144	2026-02-07 11:00:00+00	VENDITA	ACCESSORI	POTATORE KVS 8000 (SN: SL3325 371 NB) + FORBICE KV 390 (SN: PZ 2925 390NB) + 1 CATENA	NOMAT-1770630351510	XHELAJ REMZI	840	840	sold	Simone	main	f
145	2026-02-07 11:00:00+00	VENDITA	ECHO	ECHO Motosega CS 2511 TES (SN: C 74638144456)	NOMAT-1770630501655	Xhelaj Kreshnik	439	439	sold	Simone	main	f
176	2026-02-16 08:50:58.236+00	SCARICO	STIHL	Decespugliatore FSA 80 R	546519977	Bisetto Mario	0	0	sold	user_1769961017929	main	f
181	2026-02-16 16:20:32.201+00	SCARICO	VOLPI	Forbice elettronica KV390	PZ2925.389NB	Balanza Marino	0	0	sold	user_1769961017929	main	f
182	2026-02-16 16:20:32.984+00	SCARICO	VOLPI	Potatore KVS6000	SM4222498LS	Balanza Marino	0	0	sold	user_1769961017929	main	f
185	2026-02-19 09:30:48.458+00	CARICO	STIHL	Tagliabordi FSA 30.0	838110682	\N	\N	\N	available	user_1769961017929	main	f
186	2026-02-19 09:30:48.458+00	CARICO	STIHL	Batteria AS 2	937056842	\N	\N	\N	available	user_1769961017929	main	f
187	2026-02-19 09:30:48.458+00	CARICO	STIHL	Caricabatterie AL 1	935280185	\N	\N	\N	available	user_1769961017929	main	f
191	2026-02-19 10:50:01.694+00	CARICO	STIHL	Motosega MSA 190.0 T	452310979	\N	\N	\N	available	user_1769961017929	main	f
105	2026-01-09 11:00:00+00	VENDITA	ACCESSORI	TRONCARAMI RS 750 x2	NOMAT-1770546596554	MICHELE GOLFETTO	134	134	sold	Simone	main	f
110	2026-01-12 11:00:00+00	VENDITA	Echo	Echo Motosega ECHO DCS 2500T (SN: C 81535021918) + BATTERIA LBP 56V 125  E83935013630 + CARICA BATT. LCJQ 560C  T91435038990 KIT ENERGIA	NOMAT-1770571853303	MORO ENRICO	708	708	sold	Simone	main	f
192	2026-02-19 10:50:02.949+00	CARICO	STIHL	Motosega MSA 190.0 T	452310979	\N	\N	\N	available	user_1769961017929	main	f
196	2026-02-19 15:21:57.175+00	SCARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	Gasparini Francesco	0	0	sold	user_1769961017929	main	f
199	2026-02-20 14:09:50.604+00	SCARICO	VOLPI	Potatore KVS8000	SL3325.372NB	Bonetto Franco	0	0	sold	user_1769961017929	main	f
205	2026-02-22 20:46:02.271+00	CARICO	STIHL	RM 248.3 T	451394256	\N	\N	\N	available	user_1770584612559	main	t
257	2026-03-07 08:35:14.711+00	CARICO	STIHL	 AL 101	702287103	\N	\N	\N	available	user_1772723709793	main	t
208	2026-02-23 14:11:35.261+00	CARICO	Volpi	Forbice elettronica KV360	PP4624.359NB	\N	\N	\N	available	user_1769961017929	main	t
211	2026-02-27 11:56:00.401+00	CARICO	Volpi	Decespugliatore Ciao	PP4624.359NB	\N	\N	\N	available	user_1769961017929	main	f
162	2026-02-02 11:00:00+00	VENDITA	ACCESSORI	61 PMM3 Piccolo Micro Mini Catena x3 + catena m47-91 + CATENA 91 - 53M x3 + CATENA 1/4 1,1 52M x3	NOMAT-1771001013437	Bimetal	132.55	132.55	sold	Simone	main	f
214	2026-02-28 08:35:04.363+00	CARICO	NEGRI	Biotrituratore R95BRAHP65	27489101	\N	\N	\N	available	user_1769961017929	main	t
217	2026-02-28 09:25:15.284+00	SCARICO	Honda	Tosaerba HRG466C1 SKEP	MCCF1301493	Dal Corso Cristian via Massiego 13/A Casale sul Sile 3498450743 cristian.dalcorso@gmail.com	0	0	sold	user_1769961017929	main	f
220	2026-02-28 11:02:45.037+00	CARICO	STIHL	Decespugliatore FSA 60 R	450921356	\N	\N	\N	available	user_1769961017929	main	t
221	2026-02-28 11:03:06.587+00	SCARICO	STIHL	Decespugliatore FSA 60 R	450921356	Patruno Franco	0	0	sold	user_1769961017929	main	f
259	2026-03-07 08:36:11.987+00	SCARICO	STIHL	 AK 20	45204006535AE021G02910599504	Favaro Arnaldo	0	0	sold	user_1772723709793	main	f
224	2026-03-02 17:15:40.255+00	CARICO	Echo	Motosega CS-280TES	C75138079230	\N	\N	\N	available	user_1769961017929	main	t
227	2026-03-03 09:09:06.846+00	CARICO	STIHL	AK 30.0S	912736954	\N	\N	\N	available	user_1769961017929	main	t
171	2026-02-14 11:00:00+00	VENDITA	ACCESSORI	Affilatore catena Stihl	NOMAT-1771139919436	Piovesan Andrea	52	52	sold	Simone	main	f
230	2026-03-03 09:13:27.093+00	CARICO	STIHL	Tagliabordi FSA 50.0	451521369	\N	\N	\N	available	user_1769961017929	main	t
232	2026-03-03 09:18:18.638+00	SCARICO	STIHL	Tosaerba RMA 239.1	451990095	Ortolan Sara	0	0	sold	user_1769961017929	main	f
234	2026-03-03 09:18:19.711+00	SCARICO	STIHL	AK 30.0S	912736954	Ortolan Sara	0	0	sold	user_1769961017929	main	f
237	2026-03-03 10:53:09.567+00	CARICO	Honda	HRX537C7 HZEH	1032246	\N	\N	\N	available	user_1771954874726	main	t
239	2026-03-05 10:21:49.186+00	CARICO	Honda	Motozappa F220K1 GET2	FAAJ-3620207	\N	\N	\N	available	user_1769961017929	main	t
241	2026-03-05 12:54:46.829+00	SCARICO			WBC537SCV/S021B&251212012	Uliana Giovanni	0	0	sold	user_1769961017929	main	f
243	2026-03-06 10:19:38.008+00	CARICO	STIHL	Potatore HTA 86	449457136	\N	\N	\N	available	user_1769961017929	main	t
245	2026-03-06 10:55:02.906+00	CARICO	STIHL	Batteria AP 500 S	548989674	\N	\N	\N	available	user_1769961017929	main	t
247	2026-03-06 10:55:57.17+00	CARICO	STIHL	Batteria AP 300.0 S	920001603	\N	\N	\N	available	user_1769961017929	main	t
249	2026-03-06 10:59:08.717+00	SCARICO	STIHL	Batteria AP 500 S	548989613	Jesolo Gest Arl	0	0	sold	user_1769961017929	main	f
251	2026-03-06 10:59:08.983+00	SCARICO	STIHL	Batteria AP 300.0 S (281 Wh)	921008377	Jesolo Gest Arl	0	0	sold	user_1769961017929	main	f
253	2026-03-06 16:29:53.647+00	SCARICO			2541572916785	Lombardi Pietro	0	0	sold	user_1770584612559	main	f
255	2026-03-07 08:33:51.834+00	CARICO	STIHL	 MSA 70.0 C	452200572	\N	\N	\N	available	user_1772723709793	main	t
262	2026-03-07 08:41:49.216+00	CARICO	STIHL	 AK 20	910695337	\N	\N	\N	available	user_1772723709793	main	t
264	2026-03-07 08:42:42.894+00	SCARICO	STIHL	 HSA 60.1	452246465	Caredi S.R.L.	0	0	sold	user_1772723709793	main	f
266	2026-03-07 08:42:44.351+00	SCARICO	STIHL	 AL 101	702644370	Caredi S.R.L.	0	0	sold	user_1772723709793	main	f
267	2026-03-09 13:14:19.333+00	CARICO	STIGA	Trattorino XDL 210 HD	25KA3RON009394	\N	\N	\N	available	user_1772723709793	main	f
269	2026-03-09 13:15:46.169+00	CARICO	STIGA	Trattorino XD 150 HD	25KA3RON005640	\N	\N	\N	available	user_1772723709793	main	f
271	2026-03-09 13:18:26.157+00	CARICO	STIGA	Trattorino XD 150 HD	25LA3RON016463	\N	\N	\N	available	user_1772723709793	main	f
273	2026-03-09 13:20:39.101+00	CARICO	STIGA	Trattorino XD 150 HD	25KA3RON005636	\N	\N	\N	available	user_1772723709793	main	f
275	2026-03-09 13:21:52.518+00	CARICO	STIGA	Trattorino XDC 150 HD	25LA3RON017986	\N	\N	\N	available	user_1772723709793	main	f
\.


--
-- Data for Name: listini; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listini (id, brand, categoria, codice, descrizione, confezione, prezzo_a, prezzo_b, prezzo_c, prezzo_d, iva, data_aggiornamento, prezzo_promo, promo_dal, promo_al) FROM stdin;
8baaeeae-10c8-42c9-8897-d88db56cc0ed	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB455HCOP	Tagliaerba a spinta 45cm - 139cc	\N	340.00	299.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
856f26b3-9a5f-4128-adc5-751a0b0a826b	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB455HC	Tagliaerba a spinta 45cm - 139cc	\N	410.00	359.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
c81380cc-5e32-431a-ac28-608ecda79c1a	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB455SCOP	Tagliaerba semovente 45cm - 139cc	\N	420.00	369.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
b9908cb1-dd5a-45e8-962e-1fe04eede261	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB455SC	Tagliaerba semovente 45cm - 139cc	\N	505.00	445.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
8905b536-644e-4a8b-953a-7ceeda12e1fa	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB455SC3	Tagliaerba semovente 3x1 45cm - 139cc	\N	575.00	499.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
21ffc78d-aadb-4796-9471-3d5a8896c689	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB456SCVE3	Tagliaerba semovente 3x1 45cm - 166cc	\N	805.00	709.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
98db5bf2-b395-4b0d-a4e0-cbaf35806751	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB506SC	Tagliaerba semovente 50cm - 166cc	\N	610.00	535.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
9edeaae8-7ebf-45c6-b94e-be4095a1290a	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB506SC3	Tagliaerba semovente 3x1 50cm - 166cc	\N	685.00	599.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
4d0c1f77-f531-4b31-a066-22c85af5862b	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB537SC	Tagliaerba semovente 53cm - 196cc	\N	735.00	645.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
31588e30-3de1-4535-a5b4-001900fca9c4	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB537SC3	Tagliaerba semovente 3x1 53cm - 196cc	\N	805.00	709.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
f0b760bb-b3c5-4171-b24a-255af789e4ef	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB466HCM	Tagliaerba Mulching a spinta 46cm - 166cc - NEW	\N	660.00	579.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
98bf5a34-fe77-44d0-ac8f-2de4e46b2a58	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB466SCM	Tagliaerba Mulching semovente 46cm - 166cc	\N	795.00	699.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
42de4b5b-4e18-4091-b961-58ac6398cdc0	WEIBANG	TAGLIAERBA HOME SERIES	WBMWB537SCM	Tagliaerba Mulching semovente 53cm - 196cc	\N	980.00	859.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
ffd327b1-4487-4833-9725-959e8af502ba	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB507SCV3	Tagliaerba semovente 3x1 50cm - 196cc – Cardanica 3v	\N	950.00	835.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
06966ba2-3b77-416f-9904-d98ae046c873	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCV3	Tagliaerba semovente 3x1 53cm - 196cc - Cardanica 3v	\N	1050.00	925.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
ad26511c-f7ed-46ee-9908-e085426e0cb0	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCV3LV	Tagliaerba semovente 3x1 53cm - 196cc – Low Vibration	\N	1180.00	1039.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
2b72b537-718b-4b01-bb6a-59cfb46cdc0b	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCV3B	Tagliaerba semovente 3x1 53cm - 196cc - Freno lama	\N	1360.00	1199.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
8f118a21-df56-4e7e-a6a5-38c1e9b318fa	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCVM	Tagliaerba Mulching semovente 53cm - 196cc – Mecc. 3v	\N	1090.00	959.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
63f40d9f-f34c-4a7f-9367-e3ff5d8ebe07	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCVMLV	Tagliaerba Mulching semovente 53cm - 196cc – Low Vib.	\N	1240.00	1089.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
31dcdcc4-5fcd-40dc-ae6e-cd1212a40a47	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB536SKVM	Tagliaerba Mulching semovente 53cm - 180cc – Kawasaki	\N	1210.00	1069.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
b3872826-c248-4e56-92df-e6ee1f1b4b80	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCVAL	Tagliaerba semovente 53cm - 196cc – Alluminio	\N	1210.00	1069.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
ee87d827-9aba-4fd1-9489-b1ddc3a33df4	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB537SCVALB	Tagliaerba semovente 53cm - 196cc – Allum. - Freno lama	\N	1540.00	1355.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
5b2f5bcc-f61f-4e74-abc5-3f5c952052ef	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB778SCV3	Tagliaerba bilama semovente 3x1 77cm - 300cc	\N	2990.00	2789.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
f8b468db-bc74-4c96-a521-7ff283258829	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB778SCV3P	Tagliaerba bilama semovente 3x1 77cm - 300cc Ruote Piv.	\N	3210.00	2989.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
a29d5109-22a8-45bd-962f-56f47f637289	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB486SKVRB	Tagliaerba a rullo semovente 48cm - 179cc	\N	1950.00	1799.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
88f5d2c3-16fd-4e08-b2a1-1bef3edf8683	WEIBANG	TAGLIAERBA PROFESSIONAL SERIES	WBMWB567SKVRB	Tagliaerba a rullo semovente 56cm - 196cc	\N	2300.00	2099.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
d907f50c-d881-436b-a942-5a114f5dcbac	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWB384RC	Arieggiatore a coltelli 38cm - 163cc - Lama flottante	\N	990.00	869.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
3f851b84-fc3e-465e-b375-0e7cb1a816df	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWB486CRC	Arieggiatore a coltelli 48cm - 163cc - Lama flottante	\N	1350.00	1189.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
fa320984-5abb-4cad-9988-279ff15bd40b	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBLV506C	Aspirafoglie a ruote 80cm - 163cc (Sacco 240L,)	\N	1840.00	1619.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
5709bee4-fe09-40bd-a522-c4943edf2a77	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBLV50K	Aspirafoglie da sponda - 180cc Kawasaki	\N	1710.00	1499.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
919f5cfe-2d97-4670-b6aa-a6ea745980df	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBTR126H	Catenaria 163cc	\N	4500.00	4199.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
f4d06e69-b213-45c8-8722-43021391aba2	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBSH4003E	Biotrituratore elettrico 2400W - Diametro 40mm	\N	960.00	845.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
3fc5483a-9adf-4dd4-8d99-8bd83e249ea7	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBCH507LC	Cippatore compatto 196cc - Diametro 50mm	\N	1510.00	1329.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
80bb0949-2b36-44a3-9c9a-45d109b9ad7d	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBCH1013LCD	Cippatore professionale 400cc - Diametro 100mm	\N	3650.00	3399.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
182362cd-6497-4bfa-bf3d-f5db44f954ce	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBLT567HLC	Decespugliatore a ruote a spinta 56cm - 196cc	\N	870.00	765.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
470301bc-f163-4a56-adf2-42821ff39d0a	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBLT567SLC	Decespugliatore a ruote semovente 56cm - 196cc	\N	1270.00	1099.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
fac4b4c9-7722-4698-bffd-574d994da4ee	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBBC537SCV	Falciatrice professionale 53cm - 196cc	\N	1620.00	1425.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
50b22df2-9a35-43d1-bbc8-edda811d8b94	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBBC538	SCV Falciatrice professionale 53cm - 224cc	\N	1950.00	1715.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
40356fe4-7574-41e3-b096-f55d512ee450	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBBC7623LC	Falciatrice professionale 76cm - 764cc	\N	4900.00	4599.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
e9d59488-ffa7-4bbf-bbf6-bf0a2590a8f5	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBGT6813	Trinciasermenti a ruote 68cm - 392cc - Trasmis. CVT	\N	4800.00	4499.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
2783eef9-7c04-49da-aae8-8bfa94b0ca63	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBMWBGT6813TE	Trinciasermenti cingolato 68cm - 392cc	\N	7050.00	6599.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
320f9ed9-6546-42b1-bad3-2a10aec84ee0	WEIBANG	ALTRE MACCHINE PROFESSIONAL SERIES	WBAWBGTRC	Trinciasermenti cingolato 68cm - 392cc + Radiocomando	\N	8550.00	7999.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
fde017ab-9535-4c84-875a-49d7b427e061	WEIBANG	ACCESSORI	WBA4510104015	WBA4510104015 Tappo Mulching X WB454HB/SB, WB455HCOP	\N	18.00	16.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
a69ad91a-9dfb-4222-b674-c837f1450d51	WEIBANG	ACCESSORI	WBA4560104010	WBA4560104010 Tappo Mulching X WB455HC, WB455SC, WB455SC3	\N	15.00	13.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
79a0965e-924b-4ef8-a972-3aa797ef2b6f	WEIBANG	ACCESSORI	WBA5020124010	WBA5020124010 Tappo Mulching X WB506SB	\N	16.00	14.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
271acb9d-2e70-4ef6-8b84-c5024fde66a0	WEIBANG	ACCESSORI	WBA5040104010	WBA5040104010 Tappo Mulching X WB506SC, WB506SC3, WB507SCV3	\N	18.00	16.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
9e3f8de3-d441-458b-840e-a28d392c01fa	WEIBANG	ACCESSORI	WBA5330113010	WBA5330113010 Tappo Mulching X WB536SK/536SB, WB537SCV3B	\N	16.00	14.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
92331b49-b8ab-40d1-baed-e2a79b1fa78b	WEIBANG	ACCESSORI	WBA5360115010	WBA5360115010 Tappo Mulching X WB537SC, WB537SCV3	\N	24.00	21.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
ff0b43be-c2b5-4ce2-80ef-d27acbeeb27e	WEIBANG	ACCESSORI	WBA5340122010	WBA5340122010 Tappo Mulching X WB536SKAL/SBALV	\N	20.00	17.50	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
58fd9552-e11c-4e47-83e9-f507575c373a	WEIBANG	ACCESSORI	WBA5380107010	WBA5380107010 Tappo Mulching X WB537SCVAL, WB537SCVALB	\N	24.00	21.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
6bf46d12-f80f-4992-add4-8a501965f241	WEIBANG	ACCESSORI	WBR4520300000	WBR4520300000 Tappo Mulching X WB452HE, WB452SE3	\N	10.11	9.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
8f581630-91f6-4135-892c-94ae480bba9a	WEIBANG	ACCESSORI	WBAPIVOT53	WBAPIVOT53 Ruote piroettanti x 537SCV3	\N	165.00	145.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
2490e263-592b-48a4-9c25-778dc3881a3c	WEIBANG	ACCESSORI	WBABAT120	WBABAT120 Batteria Litio 120V - 4AH	\N	499.00	439.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
888c0473-c3b5-4ea9-a73d-eb6ecd125f8a	WEIBANG	ACCESSORI	WBACBAT120	WBACBAT120 Caricabatteria Litio 120V - 4AH	\N	219.00	199.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
4d5a6c1b-8f66-4563-bae4-055bde63f2e1	WEIBANG	ACCESSORI	WBA13720001	WBA13720001 Filo 4,5X660mm WBLT56HLC/SLC (Confezione da 12pz)	\N	16.00	14.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
5a179264-ae0d-4934-94c9-847b85ffe3a1	WEIBANG	ACCESSORI	WBA13430001	WBA13430001 Kit filtro aria WBBC537SCV	\N	29.00	25.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
502eb402-dd2c-47cd-831d-2d0ea2c2c038	WEIBANG	ACCESSORI	WBA12010012	WBA12010012 Kit spazzola 48cm Rasaerba a rullo	\N	150.00	130.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
50840d4a-bc57-458f-bae4-423d11de70bf	WEIBANG	ACCESSORI	WBA12110012	WBA12110012 Kit spazzola 56cm Rasaerba a rullo	\N	175.00	155.00	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
0b7bbd4f-5d2a-4a88-a0a0-533138368299	WEIBANG	ACCESSORI	WBA150406WM1	WBA150406WM1 Olio 10W-30 MOTION 4T 600ml (Confezione da 24PZ)	\N	7.50	6.50	\N	\N	22.00	2026-02-24 20:39:42.322+00	\N	\N	\N
eca1b43b-2800-40de-bf6d-bdfb8e024bd1	ECHO	MOTOSEGHE E POTATORI	ECMACS2200	Motosega elettrica ACS 2200 - 2200W	\N	199.00	175.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
0bcd045c-0290-49c0-a127-c1dc8a2a3c3e	ECHO	MOTOSEGHE E POTATORI	ECMCS2511TES	Motosega potatura X Series - CS 2511 TES	\N	525.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
01b0a643-c245-421c-9bae-ddfb7975868f	ECHO	MOTOSEGHE E POTATORI	ECMCS2511TESC	Motosega potatura X Series - CS 2511 TESC (Barra Carving)	\N	575.00	509.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
284c3975-1245-4eb2-af51-e1b4313e32cf	ECHO	MOTOSEGHE E POTATORI	ECMCS280TES	Motosega potatura CS 280 TES	\N	399.00	349.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
8ca4d9f1-4a62-4916-825d-2d1ab622402c	ECHO	MOTOSEGHE E POTATORI	ECMCS280TESC	Motosega potatura CS 280 TESC (Barra Carving)	\N	455.00	399.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
6881d41e-0901-48de-819f-f74b08fead3f	ECHO	MOTOSEGHE E POTATORI	ECMCS362TES	- 35 Motosega potatura CS 362 TES - 35 (Barra 35cm)	\N	495.00	439.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
b31f3a72-db99-4203-938b-45ba7645bf59	ECHO	MOTOSEGHE E POTATORI	ECMCS2511WES	Motosega multiuso X Series - CS 2511 WES	\N	575.00	509.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
8a7dab2a-95a9-47bb-90d8-56f56883e77f	ECHO	MOTOSEGHE E POTATORI	ECMCS362WES	Motosega multiuso CS 362 WES	\N	525.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
eb2eab07-ed09-4f84-8647-0899597c2151	ECHO	MOTOSEGHE E POTATORI	ECMCS310ES	Motosega multiuso CS 310 ES	\N	309.00	269.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
01fca3f2-dd39-41ad-80e3-5181f606c107	ECHO	MOTOSEGHE E POTATORI	ECMCS34	10ES Motosega multiuso CS 3410 ES	\N	349.00	309.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
453a8d5c-0df2-4a65-8235-1cc9296c431b	ECHO	MOTOSEGHE E POTATORI	ECMCS3510ES	Motosega multiuso CS 3510 ES	\N	389.00	339.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
6a047e8d-4312-429a-a645-e7e14e15c69f	ECHO	MOTOSEGHE E POTATORI	ECMCS3510AC	Motosega multiuso CS 3510 AC	\N	439.00	389.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
46c04876-2169-4135-aacb-bc7ac7e28f0a	ECHO	MOTOSEGHE E POTATORI	ECMCS4010ES	Motosega multiuso CS 4010 ES	\N	559.00	489.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
557f0e5b-11c1-433c-b451-77fa6c93dede	ECHO	MOTOSEGHE E POTATORI	ECMCS4310SX	Motosega multiuso X Series - CS 4310 SX	\N	795.00	699.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
0b0357cd-b381-4cbf-9cb3-adab4bb3d9ac	ECHO	MOTOSEGHE E POTATORI	ECMCS4510ES	Motosega multiuso CS 4510 ES	\N	599.00	529.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
d2edb81d-86d3-4ce3-a361-6aab519ee42b	ECHO	MOTOSEGHE E POTATORI	ECMCS4920ES	Motosega multiuso CS 4920 ES	\N	680.00	599.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
4890b3a3-c332-4467-b35b-09a2d9ca3458	ECHO	MOTOSEGHE E POTATORI	ECMCS501SX	Motosega multiuso X Series - CS 501 SX	\N	885.00	779.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
0dc4e054-a38e-43b9-8d67-119319aee3a3	ECHO	MOTOSEGHE E POTATORI	ECMCS621SX	Motosega forestale X Series - CS 621 SX	\N	1050.00	929.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
ee6b1416-f05e-4986-a13d-ce2ed8e9f22e	ECHO	MOTOSEGHE E POTATORI	ECMCS7310	- 24 Motosega forestale X Series - CS 7310 SX 24 (Barra 24")	\N	1380.00	1219.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
18cb6319-df7c-4fb0-b000-cefbe73b52f9	ECHO	MOTOSEGHE E POTATORI	ECMPPF236ES	Potatore asta fissa PPF 236 ES	\N	589.00	519.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
68f37d03-d58b-4511-9701-fee29d0e4087	ECHO	MOTOSEGHE E POTATORI	ECMPPT236ES	Potatore telescopico PPT 236 ES	\N	719.00	629.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
4765b625-103c-485b-b642-a3eaa7d3862d	ECHO	MOTOSEGHE E POTATORI	ECMPPT2620ES	Potatore telescopico Xseries - PPT 2620 ES	\N	870.00	769.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
fed4e899-08bd-42fa-8e1d-3541e1d45a98	ECHO	MOTOSEGHE E POTATORI	ECMPPAAHHD	ECMPPAAHHD Potatore accessorio Attacco tagliasiepi	\N	522.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
022afb8f-abbd-4cdd-b3e2-fb1136764216	ECHO	MOTOSEGHE E POTATORI	ECM99946400023	ECM99946400023 Potatore accessorio Attacco estensone 1.2 mt	\N	210.00	185.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
f92802cf-98dc-4a4d-9a8a-c94ae4fd539a	ECHO	DECESPUGLIATORI	ECMEGT	350 Bordatore elettrico EGT350 - 350W	\N	99.00	89.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
28c69137-1f1d-4a8b-a5fb-9afb080535c3	ECHO	DECESPUGLIATORI	ECMSRM222ESL	Decespugliatore SRM 222 ESL	\N	289.00	255.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
6b966159-c0e7-4b02-b10a-6a2dc0ed9649	ECHO	DECESPUGLIATORI	ECMSRM237TESL	Decespugliatore SRM 237 TESL	\N	449.00	395.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
351215a8-8c72-475c-a12e-1aa4c43f7cff	ECHO	DECESPUGLIATORI	ECMSRM267L	Decespugliatore SRM 267 L	\N	370.00	325.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
702a0a4a-c380-4c47-9d15-9c91916fc885	ECHO	DECESPUGLIATORI	ECMSRM2621TESL	Decespugliatore X Series - SRM 2621 TESL	\N	565.00	499.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
929d8a52-186b-4320-b549-c55adff65fdc	ECHO	DECESPUGLIATORI	ECMSRM301TESL	Decespugliatore SRM 301 TESL	\N	485.00	429.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
4edd02fe-1841-4330-a411-0bcd0a478182	ECHO	DECESPUGLIATORI	ECMSRM3021TESL	Decespugliatore X Series - SRM 3021 TESL	\N	685.00	599.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
ac1fccb7-1333-4fc3-94be-a2245155a40c	ECHO	DECESPUGLIATORI	ECMSRM3021TESU	Decespugliatore X Series - SRM 3021 TESU	\N	740.00	649.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
84af2a77-55c1-4da9-ad87-0187c6b49f4c	ECHO	DECESPUGLIATORI	ECMSRM3611TL	Decespugliatore X Series - SRM 3611 TL	\N	765.00	669.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
a3b268e1-9288-46fc-92be-8e5944808ef5	ECHO	DECESPUGLIATORI	ECMSRM3611TU	Decespugliatore X Series - SRM 3611 TU	\N	820.00	719.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
75a71894-8288-40a2-a56c-e8c6949f757e	ECHO	DECESPUGLIATORI	ECMSRM420ESLW	Decespugliatore SRM 420 ESLW	\N	695.00	615.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
0e282b7f-1f03-4b2c-9668-27b8e22f755d	ECHO	DECESPUGLIATORI	ECMSRM420TESL	Decespugliatore X Series - SRM 420 TESL	\N	890.00	785.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
c195c5d9-3780-4b26-b635-07e20fe22d23	ECHO	DECESPUGLIATORI	ECMSRM420TESU	Decespugliatore X Series - SRM 420 TESU	\N	975.00	859.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
2ee12ec3-b1a5-4db9-a869-9a39e6937d88	ECHO	DECESPUGLIATORI	ECMSRM520ESU/A	Decespugliatore X Series - SRM 520 ESU	\N	1100.00	969.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
fd7cbbcf-748f-4589-a304-4872a6fcca50	ECHO	DECESPUGLIATORI	ECMCLS520ESU	Decespugliatore X Series - CLS 520 ESU	\N	1200.00	1055.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
acc7a4e4-fcac-4c11-a4b0-34d3a514e7e3	ECHO	DECESPUGLIATORI	ECMRM3020T	Decespugliatore Zaino X Series - RM 3020 T	\N	725.00	639.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
e4ae5802-3602-401c-beab-0f702ac88710	GEOGREEN	Sementi	MICOTPWM01	Micosat F Tab Plus Wp Mini	gr.100	10.00	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
bbdfab6f-66c1-4bf8-bf3e-6e62b57a6382	ECHO	DECESPUGLIATORI	ECMRM520ES	Decespugliatore Zaino X Series - RM 520 ES	\N	1035.00	909.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
f4152a7e-49e7-4d6b-bea4-5ac969797e46	ECHO	DECESPUGLIATORI	ECARMAM520ES	ECARMAM520ES Asta decespugliatore RM520ES	\N	240.00	215.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
03225163-e0b9-4f32-8c80-ae673ce46056	ECHO	DECESPUGLIATORI	ECMPRS231M	Attacco reciprocatore per SRM222 fino a SRM420	\N	410.00	359.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
7af2d706-0109-4726-a00a-4e6752f976bf	ECHO	TAGLIASIEPI	ECMHCAS236ESLW	Tagliasiepi ad asta corta HCAS 236 ESLW	\N	679.00	599.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
98852a0e-214a-45c8-8998-94b651645bc4	ECHO	TAGLIASIEPI	ECMHCAS2620ESHD	Tagliasiepi ad asta corta X Series - HCAS 2620 ESHD	\N	760.00	669.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
a0f26f20-fea2-45aa-9b2c-1b82f17b7b1e	ECHO	TAGLIASIEPI	ECMHCA236ESLW	Tagliasiepi ad asta lunga HCA 236 ESLW	\N	695.00	615.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
55ac951f-e96e-4ec7-83b6-f16228cc3e1d	ECHO	TAGLIASIEPI	ECMHCA2620ESHD	Tagliasiepi ad asta lunga X Series - HCA 2620 ESHD	\N	790.00	699.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
e87e6549-c6b1-4acd-8155-5d3cbcf21072	ECHO	TAGLIASIEPI	ECMHCAA2403A	Attacco Tagliasiepi 2403A	\N	430.00	379.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
30abe91b-51a4-485b-abb5-7a1df33e5f46	ECHO	TAGLIASIEPI	ECMHCAA2403ALW	Attacco Tagliasiepi 2403A LW (Low Weight)	\N	430.00	379.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
caf3091f-487b-47d5-9d38-330511b46a6c	ECHO	TAGLIASIEPI	ECM28350250	Attacco Tagliasiepi 28350250	\N	460.00	405.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
952160f2-48dc-44f5-a3c5-60842c3eae5b	ECHO	TAGLIASIEPI	ECMHC2020R	Tagliasiepi HC 2020R	\N	440.00	389.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
30424a97-c292-4a06-b55b-2608f6b2525c	ECHO	TAGLIASIEPI	ECMHC2320	Tagliasiepi HC 2320	\N	495.00	435.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
14380517-c805-41c8-821d-7d98aefcab7e	ECHO	TAGLIASIEPI	ECMHCR165ES	Tagliasiepi HCR 165ES	\N	659.00	579.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
c9186ce3-5548-4d36-bb98-d0704d96f440	ECHO	TAGLIASIEPI	ECMHCR185ES	Tagliasiepi HCR 185ES	\N	669.00	589.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
b788143f-7c1c-45e7-b323-8bb96add1fe1	ECHO	TAGLIASIEPI	ECMHC2810ESR	Tagliasiepi X Series - HC 2810ESR	\N	705.00	620.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
c879e909-8f39-4b8f-a5d9-8b7cec18ed9b	ECHO	TAGLIASIEPI	ECMHCS2810ES	Tagliasiepi X Series - HCS 2810ES	\N	705.00	620.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
1d077791-9247-4013-91bb-e11b412ae528	ECHO	TAGLIASIEPI	ECMHCS3210ES	Tagliasiepi X Series - HCS 3210ES	\N	735.00	649.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
3e625437-d50e-4229-bbcd-401aabaea92f	ECHO	TAGLIASIEPI	ECMHCS3810ES	Tagliasiepi X Series - HCS 3810ES	\N	770.00	679.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
6015d94c-5296-4174-85a2-e3c330736df9	ECHO	TAGLIASIEPI	ECMHC560	Tagliasiepi elettrico HC 560 - 500W (Doppia lama 560mm)	\N	199.00	175.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
363157ce-0b87-46e4-a61f-d7424436db18	ECHO	TAGLIASIEPI	ECMHCR610	Tagliasiepi elettrico HC 610 - 700W (Doppia lama 600mm)	\N	229.00	199.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
426de3f8-c718-4907-924a-1aa5b8149a73	ECHO	SOFFIATORI	ECMES250ES	Soffiatore e aspiratore ES 250ES	\N	375.00	329.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
f95a395c-6294-483b-911f-c22be2f5b781	ECHO	SOFFIATORI	ECMES255ES	Soffiatore e aspiratore ES 255ES	\N	430.00	379.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
72cd1301-3e84-412f-a9d2-3a7f0254ffca	ECHO	SOFFIATORI	ECMPB2520	Soffiatore PB 2520	\N	319.00	279.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
18f67158-33e8-4d4b-bb0a-9818ff367b21	ECHO	SOFFIATORI	ECMPB2620	Soffiatore X Series - PB 2620	\N	419.00	369.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
7e111075-25e3-48d6-af00-d34233847a89	ECHO	SOFFIATORI	ECMPB580	Soffiatore a zaino PB 580	\N	675.00	599.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
52acc4bc-9a46-46ce-8469-2f523b5f5f00	ECHO	SOFFIATORI	ECMPB5810T	Soffiatore a zaino PB 5810 T NEW	\N	725.00	639.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
a626ed7c-4bab-4d2e-a6ea-b8eabe9834a0	ECHO	SOFFIATORI	ECMPB770	Soffiatore a zaino X Series - PB 770	\N	810.00	715.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
63defb8c-51ee-4ff0-851a-62ce862b12b6	ECHO	SOFFIATORI	ECMPB7910T	Soffiatore a zaino PB 7910 T NEW	\N	940.00	829.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
885e21f4-d27b-483f-97ca-6a919e6e48ad	ECHO	SOFFIATORI	ECMPB8010	Soffiatore a zaino X Series - PB 8010	\N	995.00	875.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
14a64fda-8388-43b2-9671-4a913dad3ae8	ECHO	SOFFIATORI	ECMPB9010T	Soffiatore a zaino PB 9010 T NEW	\N	1080.00	949.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
3b06f8a9-1de0-4324-b665-bdaaef186ed4	ECHO	ALTRE MACCHINE	ECMPAS2620ES	Multifunzione X Series - PAS 2620 ES	\N	510.00	449.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
531ec776-c8a8-4d53-99b7-2763c2f7a626	ECHO	ALTRE MACCHINE	ECMMTAAHSHD	Attacco multifunz. MTA AHS HD - Tagliasiepi asta corta HD	\N	460.00	405.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
a0d7905d-b897-4ee6-8399-e30b77d52190	ECHO	ALTRE MACCHINE	ECMMTAAHHD	Attacco multifunz. MTA AH HD - Tagliasiepi asta lunga HD	\N	515.00	449.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
8e091011-bf0d-4294-b782-d878b9500e83	ECHO	ALTRE MACCHINE	ECMMTADAH	Attacco multifunzione MTA DAH - Tagliasiepi asta lunga	\N	485.00	429.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
bd0b876a-48d5-478a-81c6-21df1f3e6738	ECHO	ALTRE MACCHINE	ECMMTALE/E	Attacco multifunzione MTA LE E - Tagliabordi	\N	210.00	185.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
f67ab365-b65f-4124-b5b9-7bbc09bca8bf	ECHO	ALTRE MACCHINE	ECMMTAPB	Attacco multifunzione MTA PB - Soffiatore	\N	195.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
63d9b4aa-cfff-43ea-a69b-989ef7d0dc5a	ECHO	ALTRE MACCHINE	ECMMTADPP	Attacco multifunzione MTA DPP - Potatore	\N	312.00	275.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
101c98ca-c7d7-4a30-9bbb-b9b778f57590	ECHO	ALTRE MACCHINE	ECMMTAPS	Attacco multifunzione MTA PS - Spazzolatrice	\N	560.00	489.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
b1631b35-7730-4beb-ba4c-f46a53a7dca6	ECHO	ALTRE MACCHINE	ECMMTADTB	Attacco multifunzione MTA DTB - Testina a filo	\N	185.00	165.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
7d893d92-6cd9-4c62-bfc9-96dba2db8d9c	ECHO	ALTRE MACCHINE	ECMMTATC	Attacco multifunzione MTA TC - Zappetta	\N	390.00	349.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
26c02121-da78-4a80-89cd-676f2dd4638d	ECHO	ALTRE MACCHINE	ECMMTA3EXT	Attacco multifunzione MTA 3EXT - Estensione	\N	79.00	69.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
9b847ecc-95f9-4e89-9aa1-9bff6faf9101	ECHO	ALTRE MACCHINE	ECMMB5810	Atomizzatore spalleggiato	\N	970.00	855.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
5eaed462-d0a5-4282-8904-3678502e5b5f	ECHO	ALTRE MACCHINE	ECAMBAD5810	ECAMBAD5810 Kit polveri	\N	115.00	99.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
91d63632-09f5-4d97-9faa-1b00dff790e4	ECHO	ALTRE MACCHINE	ECMCSG7410ES	Mototroncatrice	\N	1550.00	1365.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
f313214c-f1dd-4b07-be63-9bb6cbb8e281	ECHO	ALTRE MACCHINE	ECACWT7410	ECACWT7410 Carrello per mototroncatrice	\N	1220.00	1075.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
7b7a2f68-a7cd-448f-b0b1-37dfda85c838	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDPB310	Soffiatore a batteria 40V - DPB 310	\N	131.00	115.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
1be93d21-dd67-43b9-8ce9-2ccd6be872a9	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDCS310	Motosega a batteria 40V - DCS 310	\N	254.00	225.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
476278ba-f075-4acb-92bc-6adca329e403	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDSRM310L	Decespugliatore a batteria 40V - DSRM 310	\N	193.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
e8924add-8dab-4e21-9497-17d45260d1d3	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDHC310	Tagliasiepi a batteria 40V - DHC 310	\N	143.00	125.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
48f3dddf-a3b1-431a-94ed-a624a933650f	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDPPF310	Potatore a batteria 40V - DPPF 310	\N	190.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
97075137-dfb3-45aa-a494-81b2040aad28	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDHCA310	Tagliasiepi ad asta a batteria 40V - DHCA 310	\N	190.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
a30cac86-9c76-4daf-8b6b-f11465dcb206	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDLM310/35P	Tagliaerba a batteria 40V - DLM31035P (35cm)	\N	252.00	219.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
638ee3e2-c180-44fe-b5bb-00c067ea7f24	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDLM310/46P	Tagliaerba a batteria 40V - DLM31046P (46cm)	\N	398.00	349.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
7a33cfa3-3826-4284-b83f-371554c0c382	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECMDLM310/46SP	Tagliaerba a batteria 40V - DLM31046SP (46cm, semovente)	\N	532.00	469.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
175e2172-3d06-43b8-ad6c-1d5413ac6ecc	GEOGREEN	Sementi	MICOLWM01	Micosat F Len Wp Mini	gr.100	10.00	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
671675e9-059d-4936-a8f6-c0911821270a	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECALBP3680	ECALBP3680 Batteria Garden+ 40V 72Wh	\N	125.00	110.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
36c900f3-a654-4337-bf8d-8094baeddc9a	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECALBP36150	ECALBP36150 Batteria Garden+ 40V 144Wh	\N	179.00	159.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
6a7faf8b-5c93-47d5-933b-381a0a15fe6a	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECALC3604	ECALC3604 Caricabatterie Garden+ Rapido 40V	\N	67.00	59.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
5c1611d3-f0ab-4903-9961-a7812eb97ec3	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECAKIT40V2AH	ECAKIT40V2AH Kit energia 40V con 1x Batt. 2Ah 72Wh + 1x Caricabatteria	\N	192.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
d8e3abf2-a699-49ce-86ad-ae220f460644	ECHO	GAMMA A BATTERIA GARDEN+ 40V	ECAKIT40V4AH	ECAKIT40V4AH Kit energia 40V con 1x Batt. 4Ah 144Wh + 1x Caricabatteria	\N	246.00	215.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
1aca7f2a-0c25-4c43-99ee-4674324aad7d	ECHO	CODICE DESCRIZIONE	ECMDCS2500	Motosega a batteria 56V - DCS 2500	\N	470.00	415.00	\N	\N	22.00	2026-02-24 20:40:04.187+00	\N	\N	\N
58eb8611-2745-4af5-abdf-bfa3aa9ef1b0	ECHO	CODICE DESCRIZIONE	ECMDCS2500T	Motosega a batteria 56V - DCS 2500 T (Barra Carving)	\N	520.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
cd6f4e49-edd3-4607-9786-b4f5ec855f0a	ECHO	CODICE DESCRIZIONE	ECMDCS2500W	Motosega a batteria 56V - DCS 2500 W	\N	518.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
36f8b651-fabf-4f6b-be78-4625302383a1	ECHO	CODICE DESCRIZIONE	ECMDCS30	00 T Motosega a batteria 56V - DCS 3000T	\N	360.00	315.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
89712498-4dcd-48c6-b99a-18b30205ada5	ECHO	CODICE DESCRIZIONE	ECMDCS3500	T Motosega a batteria 56V - DCS 3500T	\N	670.00	589.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
81588caa-52f5-41c9-ab88-c1dd975fefd7	ECHO	CODICE DESCRIZIONE	ECMDHS3006	Potatore manuale a batteria 56V – DHS 3006	\N	210.00	185.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
97a513da-d347-48c4-a929-225cc06778e4	ECHO	CODICE DESCRIZIONE	OFF253001	KIT DHS3006 + Kit energia 1	\N	570.00	499.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
c238caf0-68c2-47e6-8efd-f331a6ac9f75	ECHO	CODICE DESCRIZIONE	ECMDHCAS2600HD	Tagliasiepi asta corta a batt. 56V - DHCAS2600HD (536mm)	\N	720.00	635.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
2d1d85cf-1016-4138-b023-3a6a4dec62e9	ECHO	CODICE DESCRIZIONE	ECMDHCA2600HD	Tagliasiepi asta a batt. 56V - DHCA2600HD (536mm)	\N	750.00	659.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
d594313c-0256-42b0-b122-eba5527681b7	ECHO	CODICE DESCRIZIONE	ECMDHC2200R	Tagliasiepi a batteria 56V - DHC 2200 R (562mm)	\N	575.00	509.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
e77ff647-4857-4b96-a739-c412c0dd4d1a	ECHO	CODICE DESCRIZIONE	ECMDHC2800R	Tagliasiepi a batteria 56V - DHC 2800 R (714mm)	\N	625.00	549.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
249007fc-b817-4c01-942e-d5e4bb0e926a	ECHO	CODICE DESCRIZIONE	ECMDHCS2800	Tagliasiepi a batteria 56V - DHC 2800 (714mm)	\N	750.00	659.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
f9eec67a-da29-4df9-b662-8e34647677bc	ECHO	CODICE DESCRIZIONE	ECMDLM5100SP	Tagliaerba a batteria MID Series 56V - DLM 5100 35P	\N	750.00	659.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
da635abb-87b9-455a-8d9d-81332176092c	ECHO	CODICE DESCRIZIONE	ECMDPAS2600	Multifunzione a batteria 56V - DPAS 2600	\N	450.00	399.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
1bbda70e-1283-4e32-9010-00dfc20094c4	ECHO	CODICE DESCRIZIONE	ECMDPAS300	Multifunzione a batteria 56V - DPAS 300	\N	299.00	259.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
77cbdd9c-cdb9-4bee-8e46-46154cead8ea	ECHO	CODICE DESCRIZIONE	ECMDPB2500	Soffiatore a batteria MidSeries 56V - DPB 2500	\N	350.00	309.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
e4c0faae-2628-43e5-9099-dd54c70ffd1f	ECHO	CODICE DESCRIZIONE	ECMDPB2600	Soffiatore a batteria 56V - DPB 2600	\N	490.00	429.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
6d585f46-fcd7-4556-8048-77603e2257f2	ECHO	CODICE DESCRIZIONE	ECMDPPT2600LW	Potatore telescopico a batteria 56V - DPPT 2600LW	\N	870.00	765.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
728a69ff-ad55-463f-a6fc-37fc9785ee7c	ECHO	CODICE DESCRIZIONE	ECMDSRM2600L	Decespugliatore a batteria X Series 56V - DSRM 2600 L	\N	525.00	459.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
63bd528f-4626-4477-9ec2-ca8b00f49180	ECHO	CODICE DESCRIZIONE	ECMDSRM2600U	Decespugliatore a batteria X Series 56V - DSRM 2600 U	\N	565.00	499.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
2dc8e93c-2fab-475d-9858-5de79f7cd27d	ECHO	CODICE DESCRIZIONE	ECMDSRM	3500U Decespugliatore a batteria X Series 56V - DSRM 3500 U	\N	795.00	699.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
21eee7a4-7c80-4d2b-9af0-b80fb7ed445a	ECHO	CODICE DESCRIZIONE	ECMDTT2100	Decespugliatore a batteria X Series 56V - DTT 2100	\N	780.00	689.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
41912e70-aff6-4f20-ba50-0a33a8d017cc	ECHO	CODICE DESCRIZIONE	ECADBC560	ECADBC560 Caricabatterie 56eForce Rapido 56V	\N	125.00	109.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
86631adc-3d0a-431a-ae66-1d21f32e27fc	ECHO	CODICE DESCRIZIONE	ECADBC560RC	ECADBC560RC Caricabatterie 56eForce UltraRapido 56V	\N	190.00	169.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
b45c1657-4265-48fb-b192-20fc06388be1	ECHO	CODICE DESCRIZIONE	ECALBP56V125	ECA LBP56V125 Batteria 56eForce 56V 126Wh 2,5AH	\N	235.00	209.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
f70f305a-3615-4f80-a738-16b378d3f213	ECHO	CODICE DESCRIZIONE	ECALBP56V250	ECALBP56V250 Batteria 56eForce 56V 252Wh 5AH	\N	335.00	295.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
72dfe254-bc44-43ee-87bc-b11b0d24acc2	ECHO	CODICE DESCRIZIONE	OFF233012	Kit energia 56V con 1x Batt. 2,5Ah 126Wh + 1x Caricabatt.	\N	360.00	319.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
37098dbf-6129-4988-9855-acaef980b2d7	ECHO	CODICE DESCRIZIONE	OFF233014	Kit energia 56V con 1x Batt. 5Ah 252Wh + 1x Caricabatt.	\N	595.00	399.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
6ed33d26-fa1b-43ed-a492-21a7ff0ffc47	ECHO	CODICE DESCRIZIONE	OFF233013	Kit energia 56V con 2x Batt. 2,5Ah 126Wh + 1x Caricabatt.	\N	460.00	519.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
9e95e6b0-ba9c-40a4-a657-b0e0840b2cb2	ECHO	CODICE DESCRIZIONE	OFF233015	Kit energia 56V con 2x Batt. 5Ah 226Wh + 1x Caricabatt.	\N	795.00	699.00	\N	\N	22.00	2026-02-24 20:40:04.494+00	\N	\N	\N
6cc7a4dc-c6cc-495f-a352-28e0fa48a544	GEOGREEN	Sementi	SHUR701	Hurricane 7	10 kg	108.90	104.00	98.80	89.00	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
07750d08-1f29-4846-a980-da59cba44781	GEOGREEN	Sementi	SHUR005	Hurricane (Sole+Ombra)	5 kg	54.45	52.00	50.00	\N	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
1f7813eb-b0af-4ea9-b873-5314fa95967c	GEOGREEN	Sementi	SHUR001	Hurricane	1 kg	13.75	\N	\N	\N	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
543382db-15a8-4c95-8c08-3df93fab1fde	GEOGREEN	Sementi	SBLI01	Blizzard	10 kg	97.90	93.00	88.50	80.00	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
da866150-4b98-48ee-a690-572f834739c6	GEOGREEN	Sementi	SBLI005	Blizzard (Sole+Ombra)	5 kg	54.45	52.00	50.00	\N	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
0dbaf61b-f535-4e7d-839e-94dba6f19670	GEOGREEN	Sementi	SSTR01	Strong	10 kg	85.80	81.50	77.50	70.00	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
88b6ebd0-c7d0-403c-a864-c4c3e539aadb	GEOGREEN	Sementi	SSTR005	Strong (Sole+Ombra)	5 kg	46.75	44.50	42.30	\N	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
2d91a3e4-ba9c-4a01-a1a8-4d03eba9bbb7	GEOGREEN	Sementi	SNOS01	No-sun	10 kg	85.80	81.50	77.50	69.80	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
18320cf8-a746-46be-adc8-23063e1f42af	GEOGREEN	Sementi	SNOS005	No-sun (Ombra)	5 kg	46.75	44.50	42.30	\N	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
5f2b1c20-79e5-4224-a90b-12cbcaa66546	GEOGREEN	Sementi	SREN01-SP	Renovate Sport (Rigenerazione)	10 kg	99.00	94.00	89.30	80.40	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
261f0479-17d7-4d12-8eae-19a50ce49dea	GEOGREEN	Sementi	STWI01	Twister (calpestio sole+ombra)	10 kg	119.90	114.00	108.30	97.50	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
2c547d22-5407-484c-8701-5de735f0fd44	GEOGREEN	Sementi	STOR01	Tornado	10 kg	101.75	96.70	91.90	82.80	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
48d1aa4c-bc31-4e3f-8ce0-58bbbaf29a5f	GEOGREEN	Sementi	SECO01	Ecograss	10 kg	71.50	68.00	64.60	58.20	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
209268cb-fb6d-4215-a74e-057f6848c0d0	GEOGREEN	Sementi	SWIN01	Winter Sport	10 kg	73.70	70.00	66.50	60.00	10.00	2026-02-24 20:41:32.671+00	\N	\N	\N
47049ffd-f6b7-4c28-b520-9a3a20e3cf7f	GEOGREEN	Sementi	MICOPG1	Micosat F prati & giardini	1 kg	31.20	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
9bb0f6e3-3165-4fb0-bddd-fdbb55aa1a0d	GEOGREEN	Sementi	MICOTP1	Micosat F Tab Plus	1 kg	49.82	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
eee61504-985c-4b05-b0e9-ded5bc5fbb1d	GEOGREEN	Sementi	MICOL1	Micosat F Len	1 kg	54.00	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
766e5fa4-e29d-4d2b-98ee-aeb8888770f3	GEOGREEN	Sementi	MICOU02	Micosat F Uno	gr.200	10.00	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
77165f2a-6a8e-4ce5-beb4-7ac394bae484	GEOGREEN	Sementi	MICOMO5	Micosat F MO	5 kg	140.40	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
3ecc2fcf-45dd-4e72-b1b7-24e92299d4dc	GEOGREEN	Sementi	METAGEGR1	Meta-Ge Granular	1 kg	24.90	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
b2d843fc-01e5-4fb2-8c40-20cd3fc0f23b	GEOGREEN	Sementi	METAGE1	Meta-Ge	1 lt	71.80	\N	\N	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
127cc287-2668-4814-83a0-48686edd05be	GEOGREEN	Concimi	G7025	Green 7	25 kg	47.70	45.30	43.00	38.70	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
eebb5349-d7a7-44c8-a1a0-15ff8ede26be	GEOGREEN	Concimi	G8025	Albatros Green 8 Kg 25	25 kg	60.80	57.70	54.80	49.30	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
9a19616d-14c6-41c0-af7e-ce1e11baa006	GEOGREEN	Concimi	VA025	Albatros Vigor Active Kg 25	25 kg	53.10	50.40	47.90	43.00	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
da257617-2ad7-40f6-a5ea-51893329a908	GEOGREEN	Concimi	MGP010	Universal Top	20 kg	62.50	59.40	56.50	52.60	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
788c8598-a378-4a10-bc49-0249625af6c2	GEOGREEN	Concimi	MGP080	AllRound	20 kg	64.50	61.30	58.30	54.20	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
cb8f5584-b9af-407b-9698-5cb46f326dfa	GEOGREEN	Concimi	MGE080	Pro Starter	20 kg	76.00	72.20	68.60	63.80	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
c0d2abf7-a5b4-4259-a17f-be37b6769626	GEOGREEN	Concimi	MGE110	Pro Slow	20 kg	75.00	71.30	67.80	63.00	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
e97b7f24-cf1d-4db4-9fc5-c68cbad6b11b	GEOGREEN	Concimi	MGS010	Granustar	20 kg	74.00	70.30	66.80	62.20	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
aa8fdd07-1354-488c-b56a-bb9f5071eaf9	GEOGREEN	Concimi	MGR040	Iron Power	20 kg	68.70	65.30	62.00	57.70	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
1059b0bb-f43f-4854-b8e5-0372eb3cdb28	GEOGREEN	Concimi	PAL001	Alga Park 1Kg	1 kg	38.70	32.90	29.60	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
d03b058d-7b22-4761-bbd5-477c804d2e4c	GEOGREEN	Concimi	PAL005	Alga Park 5Kg	5 kg	165.10	140.00	126.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
9a421827-e4a5-4082-8f6f-ef73c0bdec84	GEOGREEN	Concimi	PAM001	Amino K 1 Kg	1 kg	17.60	15.00	13.50	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
8b6f64ea-064e-4988-9bf9-0fff479616d5	GEOGREEN	Concimi	PAM005	Amino K 5 Kg	5 kg	66.80	56.80	51.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
426fd548-de06-4a8d-a950-b32fd743a630	GEOGREEN	Concimi	PAM025	Amino K 25 Kg	25 kg	264.00	224.00	200.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
4e2524b8-0fa1-493a-93b4-16e0eb89cc33	GEOGREEN	Concimi	PFE001	Fe Ulk 1 Kg	1 kg	32.30	27.40	24.70	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
b05de636-08d2-4ab2-a07b-718bcf129a06	GEOGREEN	Concimi	PFE010	Fe Ulk 10 Kg	10 kg	238.00	200.00	180.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
4152b636-2d1d-4a22-ba51-f53cd607a3c9	GEOGREEN	Concimi	TNK005	NPK Enduring 5 kg	5 kg	48.10	41.00	36.90	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
7b1479e7-350a-415b-bf11-332a41fbbac8	GEOGREEN	Concimi	PLK005	Leokare 5 kg	5 kg	72.60	62.00	55.80	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
060382c4-30a5-498d-a5f0-b7ed4444c6b1	GEOGREEN	Concimi	PSK001	Sevenkare 1 kg	1 kg	20.60	17.50	15.70	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
2d0b18fb-27ea-4725-be5d-c084fa767d1b	GEOGREEN	Concimi	PHU005	Humifitos 5 Kg	5 kg	40.30	34.20	30.80	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
d59ac738-1910-4727-adcc-c8bc86a00702	GEOGREEN	Concimi	PHU025	Humifitos 25 Kg	25 kg	135.20	115.00	103.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
72b1a232-9bd8-4860-a3ba-2e5403522d7f	GEOGREEN	Concimi	PRO005	Root Speed 5 Kg	5 kg	57.80	49.00	44.10	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
50aa3ad5-26fb-4753-af04-6ae3acc83644	GEOGREEN	Concimi	PDV001	Decal Vyro 1 Kg	1 kg	13.40	11.40	10.30	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
0383b50d-c3cb-405a-9380-382eab037630	GEOGREEN	Concimi	PATU005	Paint Turf	0,5 kg	73.80	\N	\N	\N	22.00	2026-02-24 20:41:32.671+00	\N	\N	\N
088c197c-daca-4775-9356-050ff8a986de	GEOGREEN	Concimi	WETU01	Wet Turf	LT.1	73.20	65.90	62.60	\N	22.00	2026-02-24 20:41:32.671+00	\N	\N	\N
64fcd43a-2783-439a-8e43-90bae6d0e734	GEOGREEN	Concimi	WETU05	Wet Turf	LT.5	256.20	230.60	219.00	\N	22.00	2026-02-24 20:41:32.671+00	\N	\N	\N
2be0c17b-4785-455c-8f28-0a8abe88a902	GEOGREEN	Concimi	ED7C05	Eden 7	5 kg	15.70	14.90	14.20	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
1874a51a-ebcf-468e-8581-e6c126a5f990	GEOGREEN	Concimi	ED8C05	Eden 8	5 kg	18.20	17.30	16.50	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
c26c5924-7ea3-46ca-a261-c6d9be36b061	GEOGREEN	Concimi	EMUC05	Eden Multi	3,5 kg	19.00	18.10	17.20	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
abd1fdc8-0664-45a0-a0a1-a1e9e8f586e7	GEOGREEN	Concimi	VAC05	Vigor Active	5 kg	14.50	13.80	13.10	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
a189b45e-798c-4847-9c79-dbc4096823c1	GEOGREEN	Concimi	EIN01	Sustenium Eden Integramix	0,25 kg	8.00	7.60	7.20	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
45e6ce40-10ee-4e22-bb8b-1def00caf0fa	GEOGREEN	Concimi	EPR01	Sustenium Eden Prevent	0,25 kg	8.50	8.10	7.70	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
950a591c-250e-4ad9-a31b-c14baa06e2de	GEOGREEN	Concimi	EFO01	Sustenium Eden Force	0,5 kg	13.00	12.30	11.70	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
253e2c1e-f5e9-4a82-a491-57e21de6c760	GEOGREEN	Concimi	ENB01	Sustenium Eden Nutribio	0,25 kg	10.00	9.50	9.00	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
202af68d-e3d9-4a0a-8dfa-c638e296bc7c	GEOGREEN	Concimi	EFB01	Sustenium Eden Ferro G Bio	0,25 kg	13.00	11.40	10.80	\N	4.00	2026-02-24 20:41:32.671+00	\N	\N	\N
6fc31594-7bbe-41c6-86d7-117b78ed458d	HONDA	MACCHINE A BATTERIA	HRG416XBPESPINTA	IZY ON HRG 416 XB  PE                                SPINTA 41 CM	\N	500.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
39cacbba-835c-4590-bdd9-a1ff53131822	HONDA	MACCHINE A BATTERIA	HRG416XBPE	HRG 416 XB  PE + BATT. 6 Ah + CARICA            350 MT/q 41 CM	\N	720.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
96dfae4e-5961-4074-a8e2-203fd2d3b78d	HONDA	MACCHINE A BATTERIA	HRX_476_XB_400_MT/Q_46_CM	HRX 476 XB                                                       400 MT/q 46 CM	\N	1050.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
2c029bf4-52ff-474c-a89e-12449f98b7c1	HONDA	MACCHINE A BATTERIA	HRX476XB	HRX 476 XB   + BATT. 6 Ah + CARICA                400 MT/q 46 CM	\N	1270.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
b232e231-05dc-473c-92a0-c278bf3a25d7	HONDA	MACCHINE A BATTERIA	HHB36AXB	SOFFIATORE HHB36AXB E	\N	220.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
9de707d1-a7dd-4cc8-a08d-fa1941ba6c5b	HONDA	MACCHINE A BATTERIA	HHH36AXB	TAGLIASIEPE HHH36AXB E6	\N	220.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
bd1ecb39-18e3-4ceb-a814-2d8891063dd1	HONDA	MACCHINE A BATTERIA	HHT36AXB	DECESP. HHT36AXB E	\N	220.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
a91ef021-6d71-410d-a680-40a3be3f5ed3	HONDA	MACCHINE A BATTERIA	HHC36BXB	MOTOSEGA HHC36BXB 35 CM	\N	260.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
14462204-7eea-4ee2-9736-51dfb8b321e4	HONDA	MACCHINE A BATTERIA	DP3620XA	BATTERIA DP3620XA 2 Ah	\N	90.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
24481633-40d4-4753-b103-d11fa2f1dd95	HONDA	MACCHINE A BATTERIA	DP3640XA	BATTERIA DP3640XA 4 Ah	\N	149.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
c90db7bc-3837-41e5-a703-ed9042c785b2	HONDA	MACCHINE A BATTERIA	DP3660XA	BATTERIA DP3660XA 6 Ah	\N	180.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
8119e03a-b573-4db2-ad23-c579fa06ef4e	HONDA	MACCHINE A BATTERIA	CV3620XA	CARICA BATTERIA CV3620XA	\N	39.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
73c30abd-0a21-430f-adc6-7d55abb9eefd	HONDA	MACCHINE A BATTERIA	CV3680XA	CARICA BATTERIA CV3680XA VELOCE	\N	69.00	\N	\N	\N	22.00	2026-02-25 07:20:59.786+00	\N	\N	\N
\.


--
-- Data for Name: listini_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listini_log (id, nome_file, brand, n_prodotti, caricato_da, caricato_il, versione) FROM stdin;
34099bbf-b77c-4b7d-9299-77455293dba5	2026 WEIBANG - Listino WEB 2026-1 - 2026.02.16 - 2026.03.15.pdf	WEIBANG	59	Simone	2026-02-24 20:39:42.945255+00	\N
e7aa42a8-6c60-415d-a54b-86377f60bdea	2026 ECHO - Listino WEB 2026-1 - 2026.02.16 - 2026.03.15.pdf	ECHO	129	Simone	2026-02-24 20:40:04.887286+00	\N
968b5537-f806-40cf-bfd5-9153d211a67c	Copia di Listino_Geogreen_Dinamico_2026_no_iva.xlsx	GEOGREEN	58	Simone	2026-02-24 20:41:34.050844+00	\N
932f5a26-4d8f-4ab9-b45b-2f966a89ceae	HONDA BATTERIA-2026.xlsx	HONDA	13	Simone	2026-02-25 07:21:00.078929+00	2026/2
\.


--
-- Data for Name: operatori; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.operatori (id, nome, creato_il) FROM stdin;
df8d3983-3162-4978-97fc-915c5afd8065	Admin	2026-02-25 10:38:22.858904+00
e89c805f-d43a-4154-b2b3-e45ece133ccf	Stefano	2026-02-25 16:45:11.378488+00
40a165ad-7216-4a68-ae78-1c13594f1c76	Simone	2026-02-25 16:45:41.656089+00
\.


--
-- Data for Name: pricing_policies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pricing_policies (id, brand, cliente_privato, professionista, promozioni, note, updated_at) FROM stdin;
3503bb05-0dac-4fdc-a011-6a2d384ded3b	ARATRI BIAGIOLI	Sconto massimo del 12% sul listino ufficiale della casa	\N	\N	\N	2026-02-22 05:26:20.424705+00
2b70e4c5-7187-4bd3-a199-48b81b9c6f3a	AVANT	Prezzo da valutare a seconda degli accessori. Listino della casa con sconto medio 30% sulle macchine e 25% sugli accessori. Il prezzo finale deve tener conto dell'eventuale ritiro dell'usato.	\N	\N	\N	2026-02-22 05:26:20.424705+00
7b00daf9-69e0-4cb8-a2d8-393aa99caa57	BELLON MIT	Aumento dell'8% sul listino + sconto max 15%	\N	\N	\N	2026-02-22 05:26:20.424705+00
3bb2a28b-6e9d-436b-8cf5-01a67694d140	BLUEBIRD	Sconto massimo del 15% sul listino ufficiale della casa	\N	\N	\N	2026-02-22 05:26:20.424705+00
e6be6a44-5f92-46f9-975a-fe081ec5cdb1	BILLY GOAT	Listino OMPRA (ultima colonna)	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna). In casi particolari, solo se serve a chiudere la trattativa e con chiari segnali di chiusura, posso scendere sotto allo sconto massimo.	Dal listino sconto max 10-13%	\N	2026-02-22 05:26:20.424705+00
33ce52e5-b2e6-4205-b474-5d816135ec77	CAPTAIN TRACTORS	\N	\N	\N	\N	2026-02-22 05:26:20.424705+00
0f85832d-6183-450c-8e82-9ee127e8916c	CASTELGARDEN	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna)	\N	\N	\N	2026-02-22 05:26:20.424705+00
ba8c6a84-d6bc-422d-b7cd-03e982f3f90c	CAST GROUP	Sconto 25% dal listino ufficiale della casa	Sconto 25% dal listino + ulteriore 3% in trattativa	\N	\N	2026-02-22 05:26:20.424705+00
e015966f-085a-438c-ba13-41c920509845	ECHO	Listino OMPRA (ultima colonna)	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna). Per accessori non compresi nel listino OMPRA, applicare sul listino ufficiale della casa uno sconto massimo del 14%. In casi particolari, solo se serve a chiudere la trattativa e con chiari segnali di chiusura, posso scendere sotto allo sconto massimo.	\N	\N	2026-02-22 05:26:20.424705+00
bb6ac812-54db-415c-bbf8-d5138aa57aa6	FERRIS	Prezzo di listino. Scontistica da valutare a seconda del caso.	\N	\N	\N	2026-02-22 05:26:20.424705+00
fe2fea67-dc83-4f7a-a553-48386656de3c	FIABA	Max 5%	Dal 5% al 7%, fino ad un max del 10%	\N	\N	2026-02-22 05:26:20.424705+00
e8a17109-a966-4588-9a5d-1de3fdd666ef	GRILLO	Listino OMPRA (ultima colonna) fino al modello FD450. Per modelli superiori usare il listino ufficiale della casa. Sconto massimo del 15% sulle macchine e del 10% sugli accessori. Il prezzo finale deve tener conto dell'eventuale ritiro dell'usato.	\N	\N	\N	2026-02-22 05:26:20.424705+00
dd0f9847-a3e1-4950-937b-05c67b528d25	HONDA	Listino OMPRA (ultima colonna)	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna). In casi particolari, solo se serve a chiudere la trattativa e con chiari segnali di chiusura, posso scendere sotto allo sconto massimo.	Applicare prezzi della Promo indistintamente. In casi particolari posso aggiungere degli omaggi (olio, catena, filo, ecc). Finanziamenti Honda a tasso zero effettivo.	\N	2026-02-22 05:26:20.424705+00
d695b209-7d75-4b1d-b4e9-27b92b06f637	MAITO	Sconto massimo del 5% sul listino ufficiale della casa	\N	\N	\N	2026-02-22 05:26:20.424705+00
383406fb-e801-4b3d-95ca-9afc2a9dad53	M-C (CARBOGREEN)	Sconto massimo del 20% sul listino ufficiale della casa	Sconto massimo del 20% + 3% sul listino ufficiale della casa	\N	\N	2026-02-22 05:26:20.424705+00
cfb1122e-5a6c-4830-b9fe-7fd342fc4b38	MM SPRAY	\N	\N	\N	\N	2026-02-22 05:26:20.424705+00
3644ad5c-f190-4ff5-9b85-aca9bc94e137	MUGGIOLI	Listino B max 20% — Listino C max 10%	Listino C max 15%	\N	\N	2026-02-22 05:26:20.424705+00
38e7a4a6-148c-4de6-8da3-93355748f052	MURATORI	Sconto massimo del 25% sul listino ufficiale della casa	\N	\N	\N	2026-02-22 05:26:20.424705+00
e36494ea-324a-4f72-8a61-8b93d23e06a9	NEGRI	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna) su tutta la gamma hobbistica	Applicare sconto massimo del 10% dal listino ufficiale della casa.	\N	\N	2026-02-22 05:26:20.424705+00
9a6dae9a-768d-423f-b055-64d8341e62df	PASQUALI	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna) su tutta la gamma hobbistica	Prezzo da valutare a seconda degli accessori. Listino della casa con sconto massimo. Il prezzo finale deve tener conto dell'eventuale ritiro dell'usato.	\N	\N	2026-02-22 05:26:20.424705+00
b803e3a6-cc2d-4e1b-a24f-87d027715bd7	ROBOTICA / ROBOT	Listino OMPRA (ultima colonna). Prezzo indicativo da confermare aggiungendo i costi di installazione in base alla distanza, ai mq del giardino, disposizione aiuole, segnalazione del giardiniere. Offerta definitiva dopo sopralluogo.	\N	\N	\N	2026-02-22 05:26:20.424705+00
b2228060-10ba-4288-8ddd-dfdcfad3eb9f	SNAPPER	Listino OMPRA (ultima colonna)	Listino OMPRA con possibilità di arrivare allo sconto massimo previsto (penultima colonna). In casi particolari posso scendere sotto allo sconto massimo.	\N	\N	2026-02-22 05:26:20.424705+00
b4206b6c-4214-4d21-b5b5-0f01264ff5fb	SOVEMA	Aumento del 10% sul listino + sconto max 25%	\N	\N	\N	2026-02-22 05:26:20.424705+00
16021c13-7cba-40ff-92d0-543b41f44677	STP SCALE	Solo rampe: 11,50€ al kg	\N	\N	\N	2026-02-22 05:26:20.424705+00
72cf29de-132e-4164-a8bb-0b699e60722d	STIHL	Vedi tabella sconti per categoria macchina (abbigliamento 10%, arieggiatori elettrici 12%, aspirapolvere/liquidi 8-10%, biotrituratori a scoppio 8%, biotrituratori elettrici 12%, decespugliatori a zaino 10%, decespugliatori a mano mix 10-15%, idropulitrici 10%, macchine batteria serie AP 3-5%, macchine batteria AS-AI-AK NO sconto, motoseghe 10%, motozappe 15-10%, multifunzione kombi mix 12-14%, potatori mix HT 10-12%, robot 15%, tagliasiepe serie 45 10%, tagliasiepe serie 82-87 10%, trattorini rasaerba 10%, trimmer elettrici 10%, trivella 10-12%)	\N	\N	\N	2026-02-22 05:26:20.424705+00
d9c69c17-9ea7-4194-9725-b8e52732b9ee	TORO	Sconto massimo del 8-10% sul listino ufficiale della casa	\N	\N	\N	2026-02-22 05:26:20.424705+00
566d5b0c-e24c-47d7-b812-37e14d95ec3e	VOLPI MY PRUNING	Sconto massimo del 5% sul listino ufficiale della casa + IVA	Sconto massimo del 10% sul listino ufficiale della casa + IVA	\N	\N	2026-02-22 05:26:20.424705+00
eb69ceb8-69e0-4eb8-b9d4-5a8b0c70aa72	VOLPI MY SPRAYERS	Listino ufficiale della casa + IVA, stornare IVA = prezzo in listino	Sconto massimo del 15-18% sul listino ufficiale della casa	\N	\N	2026-02-22 05:26:20.424705+00
294f23f9-48ff-4226-b6e3-76e9486b51ae	WEIBANG	Sconto massimo del 20% sul listino ufficiale della casa + IVA	\N	\N	\N	2026-02-22 05:26:20.424705+00
dd95d73a-ba9c-47b6-9fde-931a79a98617	FEMA	Listino A max 10% — Listino B max 14% — Listino C max 19%	\N	\N	\N	2026-02-22 05:37:00.063+00
\.


--
-- Data for Name: pv_interventi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_interventi (id, piano_id, label, timing, tipo, nota, sort_order, numero_ordine, periodo_bimestre, saltato, colore_prato, dose_effettiva, note_tecniche) FROM stdin;
6b80b86b-57a5-4c03-b985-c44fae619e31	19ed8a3c-30b6-46be-9ef4-4969131a08aa	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
63df5fe9-c557-4b39-ba38-083bd7bc8a87	19ed8a3c-30b6-46be-9ef4-4969131a08aa	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 15-20 g/m² per Hurricane o Strong. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
89efe2a3-2568-45a0-8680-a9d2d85207d2	19ed8a3c-30b6-46be-9ef4-4969131a08aa	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
d2c7e777-b407-4637-88ad-53bacfbaf41b	19ed8a3c-30b6-46be-9ef4-4969131a08aa	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Base.	4	\N	\N	f	\N	\N	\N
0337e0c8-e493-495c-932e-fde7404c07ca	de382757-6743-4ac3-93b3-a935bdaec626	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
ce30c37e-4863-4b30-b1de-b6bc9f44ac64	de382757-6743-4ac3-93b3-a935bdaec626	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 15-20 g/m² per Hurricane o Strong. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
3cad85b5-680a-4272-ad74-639c1ca9444b	de382757-6743-4ac3-93b3-a935bdaec626	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
87b99061-6e2c-46bb-9abd-41988a7f74b8	de382757-6743-4ac3-93b3-a935bdaec626	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	4	\N	\N	f	\N	\N	\N
6adc8dd2-cbcb-473f-ae64-715a381f9db6	de382757-6743-4ac3-93b3-a935bdaec626	Irrorazione Root Speed	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale fin dalla germinazione.	5	\N	\N	f	\N	\N	\N
956580d9-a0f9-4a7a-b102-345ebb511341	de382757-6743-4ac3-93b3-a935bdaec626	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Standard.	6	\N	\N	f	\N	\N	\N
d2df6339-a0a0-4bbb-9959-ae2cd927d659	63174bbb-1e96-47bc-8430-a052887203ce	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
1b8264f2-6e9b-47a0-81e0-685863a443c0	63174bbb-1e96-47bc-8430-a052887203ce	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 15-20 g/m² per Hurricane o Strong. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
39ce51d3-811e-41a3-b5a5-e414c930bde8	63174bbb-1e96-47bc-8430-a052887203ce	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
002fabfc-506d-4208-b503-f91f0ffe6cde	63174bbb-1e96-47bc-8430-a052887203ce	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	4	\N	\N	f	\N	\N	\N
4655c775-1abb-4df6-8187-5be95bd98262	63174bbb-1e96-47bc-8430-a052887203ce	Irrorazione Root Speed + Wet Turf + Algapark	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale. Wet Turf migliora la ritenzione idrica. Algapark sostiene la germinazione sotto stress.	5	\N	\N	f	\N	\N	\N
33279bd4-8cf2-438a-911d-68b5ecb19d2a	63174bbb-1e96-47bc-8430-a052887203ce	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Premium.	6	\N	\N	f	\N	\N	\N
7dafbd17-3bb4-4e26-bb62-20c13d5b5262	c1d60297-7e51-443b-97a6-6837f2f96a50	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
43853a47-1cff-4c0a-a48b-5cc6841bd9ce	c1d60297-7e51-443b-97a6-6837f2f96a50	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 20-25 g/m² per Renovate Sport. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
1ed73af0-e345-46e7-b0ea-21c3c71f802c	c1d60297-7e51-443b-97a6-6837f2f96a50	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
b92a1981-fceb-4f36-a494-7b719ecc51fb	c1d60297-7e51-443b-97a6-6837f2f96a50	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Base.	4	\N	\N	f	\N	\N	\N
816d7f90-7e96-441d-939a-381cbc0a3dd5	f4752518-fc86-47a1-a74a-c6f641401730	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
28758c41-5f2b-4568-8c86-d72cd42ea135	f4752518-fc86-47a1-a74a-c6f641401730	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 20-25 g/m² per Renovate Sport. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
b4349d07-0f84-4fcb-9f79-9fd30124771c	f4752518-fc86-47a1-a74a-c6f641401730	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
0609afb7-e90c-43c9-bb2f-eff3cdf0ee95	f4752518-fc86-47a1-a74a-c6f641401730	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	4	\N	\N	f	\N	\N	\N
7f6cc460-4e32-4541-a1ba-e448603223b4	f4752518-fc86-47a1-a74a-c6f641401730	Irrorazione Root Speed	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale su suoli sportivi.	5	\N	\N	f	\N	\N	\N
28c543bf-e9e5-40be-89e1-340d9dcdef2e	f4752518-fc86-47a1-a74a-c6f641401730	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Standard.	6	\N	\N	f	\N	\N	\N
dcc5258c-f2e6-4b83-8666-0c4e19e7e6ec	a309f617-5fdd-4777-9f70-e79d949dd277	Preparazione suolo	Prima della semina	preparazione	Fresare 15-20 cm, eliminare sassi e livellare il terreno.	1	\N	\N	f	\N	\N	\N
48481627-71fd-4322-a87f-37700d3559b2	a309f617-5fdd-4777-9f70-e79d949dd277	Semina	Primavera (apr-mag) o fine estate (ago-set)	semina	Seminare con carrello a caduta o seminatrice semovente. Dose 20-25 g/m² per Renovate Sport. Passare il rullo liscio dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	2	\N	\N	f	\N	\N	\N
79403b3a-3623-4fe6-8b17-4d35ce77668a	a309f617-5fdd-4777-9f70-e79d949dd277	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	3	\N	\N	f	\N	\N	\N
08a0c045-3fc4-4ad1-832d-116aa9f54cec	a309f617-5fdd-4777-9f70-e79d949dd277	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	4	\N	\N	f	\N	\N	\N
a5e3de8f-1e8e-424d-b6be-7d07a119debe	a309f617-5fdd-4777-9f70-e79d949dd277	Irrorazione Root Speed + Wet Turf + Algapark	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale. Wet Turf migliora la ritenzione idrica. Algapark sostiene la germinazione sotto stress.	5	\N	\N	f	\N	\N	\N
a20aa5fb-6491-4e03-b808-467236dde48c	a309f617-5fdd-4777-9f70-e79d949dd277	Primo concime post-attecchimento	4-6 settimane dalla semina — dopo 3-4 tagli	granulare	Test: strappando un ciuffo le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Premium.	6	\N	\N	f	\N	\N	\N
1bb4bdc4-d7bd-45e4-8def-1fa2644bba73	503274e5-16d1-43ed-a131-2fc609a91a14	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
8f8e50bb-e06d-4acb-b4a6-f7abdfeab28e	503274e5-16d1-43ed-a131-2fc609a91a14	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Eliminare feltro, muschio e materiale morto. Livellare le zone denudate.	2	\N	\N	f	\N	\N	\N
800eed97-2630-4daa-8d6e-2957c19df2ed	503274e5-16d1-43ed-a131-2fc609a91a14	Semina	Settimana 1 — dopo arieggiatura	semina	Hurricane per qualità e autoriparo. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
36528077-0e8b-49a4-9165-97fa13851407	503274e5-16d1-43ed-a131-2fc609a91a14	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
f6c5abdb-4e4a-4869-9171-cbaead4d2fca	503274e5-16d1-43ed-a131-2fc609a91a14	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Base.	5	\N	\N	f	\N	\N	\N
0491264e-b96f-40f4-ae4e-faa38f9aad32	01ea4c12-799e-442d-be45-cdd8c70a7410	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
c320affd-b59e-45d0-8720-4e8cb4373f6f	01ea4c12-799e-442d-be45-cdd8c70a7410	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Eliminare feltro, muschio e materiale morto. Livellare le zone denudate.	2	\N	\N	f	\N	\N	\N
d96e8128-c1c8-4986-a1ee-d795cc1b97cb	01ea4c12-799e-442d-be45-cdd8c70a7410	Semina	Settimana 1 — dopo arieggiatura	semina	Hurricane per qualità e autoriparo. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
37d53fe3-c23d-4b4d-ae34-ed39ad821f24	01ea4c12-799e-442d-be45-cdd8c70a7410	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
654df6f6-14b9-43b8-a911-085ad1244f8a	01ea4c12-799e-442d-be45-cdd8c70a7410	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	5	\N	\N	f	\N	\N	\N
f15f4925-082e-462f-8d39-fa08be347ad3	01ea4c12-799e-442d-be45-cdd8c70a7410	Irrorazione Root Speed	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale fin dalla germinazione.	6	\N	\N	f	\N	\N	\N
fd195b4b-63a3-4d1a-8db6-b3bcc8e544cd	01ea4c12-799e-442d-be45-cdd8c70a7410	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Standard.	7	\N	\N	f	\N	\N	\N
8ac1d349-6475-4e80-902a-1c1bd649237d	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
173bcc5e-41c6-45d1-836e-253f96f2cf7f	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Eliminare feltro, muschio e materiale morto. Livellare le zone denudate.	2	\N	\N	f	\N	\N	\N
69cd2681-9558-4b31-a18b-d4034a771287	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Semina	Settimana 1 — dopo arieggiatura	semina	Hurricane per qualità e autoriparo. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
d24f1eff-7621-403d-92d2-527fda97b250	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
90ddfb0c-c9b7-44c7-a865-2e957e15be54	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	5	\N	\N	f	\N	\N	\N
97ac116a-b92e-4f8a-8399-2f20ff091ed7	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Irrorazione Root Speed + Wet Turf + Algapark	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale. Wet Turf migliora la ritenzione idrica. Algapark sostiene la germinazione sotto stress.	6	\N	\N	f	\N	\N	\N
d68fabaa-3ceb-4056-a7af-32356f936fc4	30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Ornamentale Premium.	7	\N	\N	f	\N	\N	\N
3a23db22-2de0-42b8-aca5-06cc01ac83c3	071a2e49-c0d3-41b0-985d-e68ca8ba714b	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
e226f2da-780c-4469-a6cb-447da4c90158	071a2e49-c0d3-41b0-985d-e68ca8ba714b	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Per sportivo: aerazione a forchettoni profondi per alleviare la compattazione. Eliminare feltro e materiale morto.	2	\N	\N	f	\N	\N	\N
51cdaac9-1daa-4395-afbe-fd5d97beac28	071a2e49-c0d3-41b0-985d-e68ca8ba714b	Semina	Settimana 1 — dopo arieggiatura	semina	Renovate Sport per insediamento rapido e resistenza al calpestio. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
72b3ad33-5147-4ca7-a5ce-05652c6ad3aa	071a2e49-c0d3-41b0-985d-e68ca8ba714b	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
92f06e66-0cbe-4c11-a3d6-0b6193635055	071a2e49-c0d3-41b0-985d-e68ca8ba714b	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Base.	5	\N	\N	f	\N	\N	\N
12be8974-e894-4791-a17b-4523d7060fdd	a6a10680-bd23-4250-982e-8d6e93d85054	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
f2228a52-1d9e-4320-b028-46c7c4fe2299	a6a10680-bd23-4250-982e-8d6e93d85054	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Per sportivo: aerazione a forchettoni profondi per alleviare la compattazione. Eliminare feltro e materiale morto.	2	\N	\N	f	\N	\N	\N
945c877f-d0ed-468f-9d45-d6ef516b75f9	a6a10680-bd23-4250-982e-8d6e93d85054	Semina	Settimana 1 — dopo arieggiatura	semina	Renovate Sport per insediamento rapido e resistenza al calpestio. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
902ccff9-927e-4473-83d2-a8b6150cc093	a6a10680-bd23-4250-982e-8d6e93d85054	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
13a85961-babc-40ff-9645-6f775b48026a	a6a10680-bd23-4250-982e-8d6e93d85054	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	5	\N	\N	f	\N	\N	\N
624340e4-c26f-4650-987b-05f069603013	a6a10680-bd23-4250-982e-8d6e93d85054	Irrorazione Root Speed	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale su suoli sportivi compatti.	6	\N	\N	f	\N	\N	\N
7c2d31ef-8e56-4171-b7e4-3b16d579fc19	a6a10680-bd23-4250-982e-8d6e93d85054	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Standard.	7	\N	\N	f	\N	\N	\N
1213246b-1b80-4a2d-8c0c-e1d3e3cbccf2	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Taglio erba	Settimana 1 — prima di tutto	preparazione	Tagliare l'erba a 3-4 cm per facilitare le operazioni successive.	1	\N	\N	f	\N	\N	\N
fb4a2039-9f82-43e1-9ca2-46bfd9d1b669	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Arieggiatura	Settimana 1 — dopo il taglio	preparazione	Arieggiatura sfiorando il terreno. Per sportivo: aerazione a forchettoni profondi per alleviare la compattazione. Eliminare feltro e materiale morto.	2	\N	\N	f	\N	\N	\N
621ae76c-cc6d-4b78-9757-c0e9557bd803	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Semina	Settimana 1 — dopo arieggiatura	semina	Renovate Sport per insediamento rapido e resistenza al calpestio. Dose 40 g/m² su zone degradate. Passare il rullo chiodato prima e dopo la semina. A seguire brevi e frequenti irrigazioni 2-3 volte al giorno per le prime 2 settimane. Mantenere il terreno costantemente umido fino alla germinazione.	3	\N	\N	f	\N	\N	\N
cc99b731-f6fa-4c88-ac5f-009919ed7812	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Vigor Active a spaglio	Dopo la semina	granulare	Distribuire Vigor Active a spaglio con carrello dopo la semina.	4	\N	\N	f	\N	\N	\N
f28bf089-5c0d-48b2-8b0f-d68d06881dd7	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Irrorazione Humifitos + Micosat F	Dopo la semina — stesso giorno o giorno successivo	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Humifitos nutre i microrganismi del suolo migliorando la struttura: diluire insieme a Micosat F MO in acqua. A seguire brevi irrigazioni per far penetrare il prodotto. Mantenere il terreno umido nei 3-5 giorni successivi per favorire la colonizzazione microbica. Se si usa Micosat F PG: distribuire i microgranuli a spaglio separatamente. Irrorare Humifitos diluito in acqua separatamente.	5	\N	\N	f	\N	\N	\N
ab0ca19f-8ef6-41af-8f3a-9f8cda29327f	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Irrorazione Root Speed + Wet Turf + Algapark	Settimane 1-3	trattamento	Irrorazione con zaino a spalla o barra irroratrice. Root Speed stimola l'approfondimento radicale. Wet Turf migliora la ritenzione idrica. Algapark sostiene la germinazione sotto stress da calpestio.	6	\N	\N	f	\N	\N	\N
2222b59f-a485-4691-ba7b-16d8f374881d	f7d9eafc-5b10-4d77-ab94-ddd4c3531936	Primo concime post-attecchimento	Settimane 3-4 — dopo 3-4 tagli	granulare	Test: strappare un ciuffo, le radici devono resistere. Da qui segui il piano Mantenimento Sportivo Premium.	7	\N	\N	f	\N	\N	\N
3d227236-c57a-4a1d-9fbf-0d0730bf547c	973c555b-7c50-40c9-896a-1036eb3e2d56	Risveglio primaverile	Marzo	granulare	Primo N stagionale. Temperatura suolo > 8°C.	1	\N	\N	f	\N	\N	\N
6cffa65f-ca5e-4af4-a2ce-de7baf0440ed	973c555b-7c50-40c9-896a-1036eb3e2d56	Rinforzo primaverile	Aprile (+6 settimane)	granulare	6 settimane di distanza dal precedente.	2	\N	\N	f	\N	\N	\N
6a95774e-03ec-4b1c-8e78-5ce6b7ad7941	973c555b-7c50-40c9-896a-1036eb3e2d56	Pre-estate	Fine maggio - giugno	granulare	Green 8 alto K. Ultimo granulare prima dei mesi caldi.	3	\N	\N	f	\N	\N	\N
523b4b8f-0039-4202-86ed-a632c4fbb9e8	973c555b-7c50-40c9-896a-1036eb3e2d56	Ripartenza autunnale	Settembre	granulare	Ripresa vegetativa autunnale.	4	\N	\N	f	\N	\N	\N
632966ab-812a-4e88-a390-3022a4b289ce	973c555b-7c50-40c9-896a-1036eb3e2d56	Nutrimento invernale	Novembre	granulare	Green 8 alto K. Chiusura stagionale.	5	\N	\N	f	\N	\N	\N
16c6dee2-5381-4d11-a92d-79135ca2c24a	1481c5e3-9bda-466b-a6be-6e15d2e8e56a	Risveglio + biostimolazione	Marzo	granulare	Green 7 + Humifitos + Micosat PG in unica passata. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	1	\N	\N	f	\N	\N	\N
77e34451-e445-4e73-9755-54aad3004a50	1481c5e3-9bda-466b-a6be-6e15d2e8e56a	Rinforzo primaverile	Aprile (+6 settimane)	granulare	Rinforzo azotato.	2	\N	\N	f	\N	\N	\N
7be46ba6-7882-452c-9351-d7ecb7aa3b1f	1481c5e3-9bda-466b-a6be-6e15d2e8e56a	Pre-estate + ammendante	Fine maggio - giugno	granulare	Green 8 + Humifitos: riserva organica per l'estate. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	3	\N	\N	f	\N	\N	\N
73fc088b-a9e1-403b-bf55-ebb1aef08bec	1481c5e3-9bda-466b-a6be-6e15d2e8e56a	Ripartenza + biostimolazione	Settembre	granulare	Rinnovo flora batterica. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	4	\N	\N	f	\N	\N	\N
a701bd1c-7a4b-4853-8189-c0887456d2fd	1481c5e3-9bda-466b-a6be-6e15d2e8e56a	Nutrimento invernale	Novembre	granulare	Green 8 alto K. Chiusura stagionale.	5	\N	\N	f	\N	\N	\N
571d9387-a328-4f5f-91c3-c053dcc14101	e5286c80-97d1-4420-98e3-8852eb4a09eb	Risveglio premium	Marzo	granulare	Green 7 + Humifitos + Micosat PG. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	1	\N	\N	f	\N	\N	\N
29a1a3b4-3225-4437-a9dd-f4a70d920882	e5286c80-97d1-4420-98e3-8852eb4a09eb	Rinforzo primaverile	Aprile (+6 settimane)	granulare	Rinforzo azotato pulito.	2	\N	\N	f	\N	\N	\N
d9cf8c1f-25ff-4b41-87c8-c5e734680f8a	e5286c80-97d1-4420-98e3-8852eb4a09eb	Pre-estate + Wet Turf	Fine maggio - giugno	granulare	Wet Turf riduce irrigazioni necessarie in terreni compatti. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	3	\N	\N	f	\N	\N	\N
19590b32-f3c9-407b-a390-dc9e6ce7d402	e5286c80-97d1-4420-98e3-8852eb4a09eb	Fogliare estivo	Luglio	fogliare	Ore fresche obbligatorie. Non oltre 28°C. Ripetibile ogni 3-4 settimane. LeoKare compatibile — nessun Humifitos in questo passaggio.	4	\N	\N	f	\N	\N	\N
733ce150-615d-4aa6-9928-6b0c6aa414c8	e5286c80-97d1-4420-98e3-8852eb4a09eb	Ripartenza autunnale premium	Settembre	granulare	Con temperature in calo Micosat PG dà il massimo effetto. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	5	\N	\N	f	\N	\N	\N
e7aff52a-d7ca-4034-9be1-6696396f1a23	e5286c80-97d1-4420-98e3-8852eb4a09eb	Nutrimento invernale	Novembre	granulare	Green 8 alto K. Chiusura stagionale.	6	\N	\N	f	\N	\N	\N
2ede58f1-6e3e-46a7-bc26-ba426d5422ec	3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	Concimazione granulare + biostimolanti	Marzo	granulare	AllRound a dose per m². Humifitos e Micosat MO a dose fissa per campo — distribuire uniformemente e irrigare leggermente dopo. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	1	\N	\N	f	\N	\N	\N
bde2881a-a8e5-46d4-a2b4-f3a054afb0d3	3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	Biostimolante intermedio	Aprile - Maggio	trattamento	Solo Humifitos + Micosat MO a dose ridotta — mantiene attiva la flora batterica tra le concimazioni granulari. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	2	\N	\N	f	\N	\N	\N
2dc6270a-155e-4c0e-845e-7456f4424778	3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	Concimazione granulare + biostimolanti	Giugno	granulare	Seconda concimazione granulare. AllRound a dose per m², Humifitos e Micosat MO dose fissa. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	3	\N	\N	f	\N	\N	\N
18b2d881-e6bf-4008-90c6-2b975c37801f	3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	Biostimolante intermedio	Luglio - Agosto	trattamento	Mantenimento flora batterica nei mesi caldi. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	4	\N	\N	f	\N	\N	\N
1a298530-1f78-47d6-bc84-1f1bb7016e18	3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	Concimazione granulare + biostimolanti	Settembre	granulare	Terza concimazione granulare. Ripresa autunnale post-estate. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	5	\N	\N	f	\N	\N	\N
6fdbe2c2-a158-4132-a1e6-7a3c59fc7447	ff90b067-eef5-4cdf-b395-b5eb9048d0b1	Risveglio primaverile	Marzo	granulare	AllRound CRF su suolo sportivo.	1	\N	\N	f	\N	\N	\N
38f2645c-aba1-4df1-9a70-b4a63589217a	ff90b067-eef5-4cdf-b395-b5eb9048d0b1	Pre-estate	Fine maggio - giugno	granulare	Green 8 alto K per resistenza estiva e al calpestio.	2	\N	\N	f	\N	\N	\N
4beb932b-0d1a-48cb-9697-2ea8a54fe4ce	ff90b067-eef5-4cdf-b395-b5eb9048d0b1	Ripartenza autunnale	Settembre	granulare	AllRound per ripresa autunnale.	3	\N	\N	f	\N	\N	\N
8eb0d9a9-520d-4296-9209-39b8a1b3fbdb	ff90b067-eef5-4cdf-b395-b5eb9048d0b1	Nutrimento invernale	Novembre	granulare	Green 8 chiusura stagionale.	4	\N	\N	f	\N	\N	\N
3a810895-eb46-4a3a-85ac-280bfc8a6eaa	0acdf068-c6b5-485a-9da9-47963e7f47e8	Risveglio + biostimolazione	Marzo	granulare	AllRound + Humifitos + Micosat PG. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	1	\N	\N	f	\N	\N	\N
624ebc73-ee42-4f1e-b46b-47287a0ec698	0acdf068-c6b5-485a-9da9-47963e7f47e8	Pre-estate + ammendante	Fine maggio - giugno	granulare	Green 8 + Humifitos. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	2	\N	\N	f	\N	\N	\N
27d7f751-a81c-4d13-9429-af50fc53385a	0acdf068-c6b5-485a-9da9-47963e7f47e8	Ripartenza + biostimolazione	Settembre	granulare	AllRound + Humifitos + Micosat PG. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	3	\N	\N	f	\N	\N	\N
cde1b3f2-bbde-4428-b6f0-38aafc462015	0acdf068-c6b5-485a-9da9-47963e7f47e8	Nutrimento invernale	Novembre	granulare	Green 8 chiusura stagionale.	4	\N	\N	f	\N	\N	\N
4a06bff9-1c40-4dc5-9b02-b6559003468b	0224846d-0162-4a9c-9860-627df27a5ce4	Risveglio premium	Marzo	granulare	AllRound + Humifitos + Micosat MO. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	1	\N	\N	f	\N	\N	\N
46973b67-a8f2-4ad8-a4d1-9b59197e124a	0224846d-0162-4a9c-9860-627df27a5ce4	Pre-estate + Wet Turf	Fine maggio - giugno	granulare	Ottimizzazione idrica per suoli sportivi. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	2	\N	\N	f	\N	\N	\N
617c4f6d-3f0f-4e1f-a031-1ff61dad6808	0224846d-0162-4a9c-9860-627df27a5ce4	Fogliare estivo	Luglio	fogliare	Ore fresche obbligatorie. Ripetibile ogni 3-4 settimane. LeoKare compatibile — nessun Humifitos in questo passaggio.	3	\N	\N	f	\N	\N	\N
14730732-c080-4a2f-9d04-1b74c467183c	0224846d-0162-4a9c-9860-627df27a5ce4	Ripartenza autunnale premium	Settembre	granulare	AllRound + Humifitos + Micosat MO. Irrigare subito leggermente (5-10 min) dopo la distribuzione — quanto basta per far penetrare, non per dilavare. Tenere il terreno umido nei 3-5 giorni successivi: i microrganismi del Micosat F hanno bisogno di umidità per colonizzare la sostanza organica. Evitare il sole diretto sul prodotto prima dell'irrigazione.	4	\N	\N	f	\N	\N	\N
001c0b38-c1d4-4488-9df9-01adde09a7f5	0224846d-0162-4a9c-9860-627df27a5ce4	Nutrimento invernale	Novembre	granulare	Green 8 alto K. Chiusura stagionale.	5	\N	\N	f	\N	\N	\N
\.


--
-- Data for Name: pv_intervento_prodotti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_intervento_prodotti (id, intervento_id, prodotto_id, dose_gm2, sort_order, dose_fissa, dose_fissa_label) FROM stdin;
43fe910f-7699-4d0d-8244-3d37589e51aa	89efe2a3-2568-45a0-8680-a9d2d85207d2	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
3b0e4c25-48e3-4211-a680-d788dd008340	d2c7e777-b407-4637-88ad-53bacfbaf41b	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
6fd254de-0f17-4973-871d-7525e01e3d10	3cad85b5-680a-4272-ad74-639c1ca9444b	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
bec07924-3830-4841-a3c5-a8d9a7955e69	87b99061-6e2c-46bb-9abd-41988a7f74b8	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
ec22ad56-103b-454f-9079-2686fa99d6c3	87b99061-6e2c-46bb-9abd-41988a7f74b8	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
eab5628a-86e3-4590-a0f6-c428756a61f7	6adc8dd2-cbcb-473f-ae64-715a381f9db6	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
5d956256-20f3-4b4b-84ac-e6f0c414b56f	956580d9-a0f9-4a7a-b102-345ebb511341	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
a1a801c5-f407-43ca-8951-91c136f20058	39ce51d3-811e-41a3-b5a5-e414c930bde8	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
469fefe3-686f-4be8-b45a-30517cebe18b	002fabfc-506d-4208-b503-f91f0ffe6cde	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
3d0e4ddb-c092-4d7b-be0b-6e1017752797	002fabfc-506d-4208-b503-f91f0ffe6cde	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
fbe14cce-6494-4b65-8414-988b99582786	4655c775-1abb-4df6-8187-5be95bd98262	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
72733438-5f1b-4087-a9d7-53add37301fc	4655c775-1abb-4df6-8187-5be95bd98262	4245263e-261a-4c24-857f-7f09c90557ff	1	2	f	\N
241b405f-d456-417c-bd2a-ebec02934bed	4655c775-1abb-4df6-8187-5be95bd98262	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	5	3	f	\N
d4db7150-adbe-46fc-8b94-321407e50d46	33279bd4-8cf2-438a-911d-68b5ecb19d2a	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
90f732f0-418d-4952-9280-df85e64a3d23	1ed73af0-e345-46e7-b0ea-21c3c71f802c	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
e86fb020-d639-449b-a7d8-e1ecad39d78f	b92a1981-fceb-4f36-a494-7b719ecc51fb	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
206af757-a151-4202-b3c0-a4fbb212a1e9	b4349d07-0f84-4fcb-9f79-9fd30124771c	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
d15345fb-d2cf-490b-a8bc-e9c028363536	0609afb7-e90c-43c9-bb2f-eff3cdf0ee95	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
7b4d83c0-9daa-4243-8a91-90c9bc3fe560	0609afb7-e90c-43c9-bb2f-eff3cdf0ee95	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
cf402937-bbb5-4375-b05b-41864eb6e2f5	7f6cc460-4e32-4541-a1ba-e448603223b4	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
ffa7f360-fbce-4aba-a024-e41d32998f49	28c543bf-e9e5-40be-89e1-340d9dcdef2e	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
5b2126f1-0563-4331-acae-dd639a6be029	79403b3a-3623-4fe6-8b17-4d35ce77668a	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
0bca7eb9-2da5-4178-9718-23c89ef4a5c3	08a0c045-3fc4-4ad1-832d-116aa9f54cec	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
b8f431c5-5895-442f-bc97-62d928ea232a	08a0c045-3fc4-4ad1-832d-116aa9f54cec	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
352f6618-daf0-411a-b202-04c1375353d7	a5e3de8f-1e8e-424d-b6be-7d07a119debe	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
f19b4a20-7439-41a9-9503-1a5508d7d337	a5e3de8f-1e8e-424d-b6be-7d07a119debe	4245263e-261a-4c24-857f-7f09c90557ff	1	2	f	\N
b506f468-4b45-467e-8a0d-8df191846e56	a5e3de8f-1e8e-424d-b6be-7d07a119debe	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	5	3	f	\N
44e44fa2-7d48-4119-930b-eac2394c8cbd	a20aa5fb-6491-4e03-b808-467236dde48c	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
a78550fb-bf32-48b7-b9bf-1c9c53793fe2	36528077-0e8b-49a4-9165-97fa13851407	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
91487cec-2da6-4616-8da0-f2251621a2ed	f6c5abdb-4e4a-4869-9171-cbaead4d2fca	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
c4b1044e-9f78-4516-99a3-aa5ab3122197	37d53fe3-c23d-4b4d-ae34-ed39ad821f24	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
c3855256-315e-4eac-8f18-e228f15587f0	654df6f6-14b9-43b8-a911-085ad1244f8a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
1301a3a1-ee6c-41f3-aec6-d8e94a84782e	654df6f6-14b9-43b8-a911-085ad1244f8a	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
259c5a95-b1af-4732-970b-139adc0b2a69	f15f4925-082e-462f-8d39-fa08be347ad3	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
3f7cf37d-799c-4189-8c12-8048d949ec52	fd195b4b-63a3-4d1a-8db6-b3bcc8e544cd	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
8b4a6748-28fc-4c14-a7e3-be85652dea6b	d24f1eff-7621-403d-92d2-527fda97b250	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
64edbfa3-53f5-4ca1-8a59-d53b44b0a349	90ddfb0c-c9b7-44c7-a865-2e957e15be54	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
422ab0e7-b810-49bf-b690-0caf642ba6f2	90ddfb0c-c9b7-44c7-a865-2e957e15be54	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
8772af17-625b-45e9-9c1c-ba20688a21be	97ac116a-b92e-4f8a-8399-2f20ff091ed7	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
2b208694-efa2-4e35-a3c9-cf559abe3437	97ac116a-b92e-4f8a-8399-2f20ff091ed7	4245263e-261a-4c24-857f-7f09c90557ff	1	2	f	\N
002636ce-362b-4277-a2ed-a1b63e88eccc	97ac116a-b92e-4f8a-8399-2f20ff091ed7	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	5	3	f	\N
18ed8662-e6ce-4493-9174-50b671bd7ba4	d68fabaa-3ceb-4056-a7af-32356f936fc4	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
2105b89f-a70e-47d9-b4d5-9a5252fb6dcf	72b3ad33-5147-4ca7-a5ce-05652c6ad3aa	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
19da2e8a-a869-4b9e-92c9-b1fa4759e133	92f06e66-0cbe-4c11-a3d6-0b6193635055	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
f6ab6e44-0867-44bc-a1b3-a83f8d55c588	902ccff9-927e-4473-83d2-a8b6150cc093	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
dc4c11ea-a62f-478d-b94e-fc43f3885ee6	13a85961-babc-40ff-9645-6f775b48026a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
c039fc9c-2a4e-4d67-9833-a7e1147fcc94	13a85961-babc-40ff-9645-6f775b48026a	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
f8ce44ee-298b-4c61-8dd5-b1d9235869b7	624340e4-c26f-4650-987b-05f069603013	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
b5818b12-c6cb-479f-8e45-fb6126880845	7c2d31ef-8e56-4171-b7e4-3b16d579fc19	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
aef2fff1-d313-4faa-a6ba-db982afba5a4	cc99b731-f6fa-4c88-ac5f-009919ed7812	cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	50	1	f	\N
aab50711-2a2f-4537-8ac2-3c9a1ddc5c72	f28bf089-5c0d-48b2-8b0f-d68d06881dd7	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	1	f	\N
8598cfe9-98aa-4aac-8f26-7e83a03e326a	f28bf089-5c0d-48b2-8b0f-d68d06881dd7	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	2	f	\N
d499ea6d-7f0a-41e7-8517-4a7dfa80826a	ab0ca19f-8ef6-41af-8f3a-9f8cda29327f	4b5f0a8f-912d-4a75-839f-c223c7d92cb1	2	1	f	\N
1b27d709-21b4-46a8-a0c8-ee95aab84ff1	ab0ca19f-8ef6-41af-8f3a-9f8cda29327f	4245263e-261a-4c24-857f-7f09c90557ff	1	2	f	\N
db36bfdc-94e7-4b97-93a5-f325bad29aef	ab0ca19f-8ef6-41af-8f3a-9f8cda29327f	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	5	3	f	\N
6d027504-a19e-46e9-8301-67d81d15e1bb	2222b59f-a485-4691-ba7b-16d8f374881d	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
ef868a02-40e5-4aa3-b8ed-c04d05155e44	3d227236-c57a-4a1d-9fbf-0d0730bf547c	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
8b9a21c9-6787-4469-9bef-9ade7805f3be	6cffa65f-ca5e-4af4-a2ce-de7baf0440ed	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
c44ca9a4-4486-444b-82ee-599380ed3c48	6a95774e-03ec-4b1c-8e78-5ce6b7ad7941	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
25640e09-ed10-4e31-8850-e99fd4c23e82	523b4b8f-0039-4202-86ed-a632c4fbb9e8	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
ad40da3c-790b-490a-9d20-9dd20389d4f9	632966ab-812a-4e88-a390-3022a4b289ce	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
2963c647-7a30-4bab-a9f9-35ea4f9fdf9a	16c6dee2-5381-4d11-a92d-79135ca2c24a	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
df51b82b-936f-4fa1-abc2-6ee0d5c4a19f	16c6dee2-5381-4d11-a92d-79135ca2c24a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
e73b212f-162a-430e-a46f-60e9c7ef149b	16c6dee2-5381-4d11-a92d-79135ca2c24a	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
6ac7b42f-9c28-4f66-835b-224b5d12fb4a	77e34451-e445-4e73-9755-54aad3004a50	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
d63933be-51e2-4d3c-a699-9db2d580652e	7be46ba6-7882-452c-9351-d7ecb7aa3b1f	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
8fbb6182-d889-4a89-a663-40a0211b5a51	7be46ba6-7882-452c-9351-d7ecb7aa3b1f	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
3fcfd52e-cf61-41a8-8a4b-9cc7604b6c95	73fc088b-a9e1-403b-bf55-ebb1aef08bec	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
8eaf268f-68b8-4361-854e-71307e1e0668	73fc088b-a9e1-403b-bf55-ebb1aef08bec	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
441af83e-4034-4d70-95bd-a36918d3f542	73fc088b-a9e1-403b-bf55-ebb1aef08bec	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
8082c46b-dd0f-4dad-9a50-54fed2bb0c2a	a701bd1c-7a4b-4853-8189-c0887456d2fd	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
e42789c1-2696-46e7-a92c-300daf114c2f	571d9387-a328-4f5f-91c3-c053dcc14101	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
792b2d53-1235-4aac-b7f7-82123267df6d	571d9387-a328-4f5f-91c3-c053dcc14101	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
513f9bd8-2a1e-449f-a7e8-a04b01327fdd	571d9387-a328-4f5f-91c3-c053dcc14101	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
ce91d0a0-0f9d-4935-8599-c5632b0090a8	29a1a3b4-3225-4437-a9dd-f4a70d920882	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	25	1	f	\N
7131bd9a-32b0-4322-8117-3ff2fe43a680	d9cf8c1f-25ff-4b41-87c8-c5e734680f8a	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
7ec7e069-0f54-4cd8-83dc-33b5ca163f25	d9cf8c1f-25ff-4b41-87c8-c5e734680f8a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
afe9d9b6-b654-4f4b-a030-7dd6c940fe5e	d9cf8c1f-25ff-4b41-87c8-c5e734680f8a	4245263e-261a-4c24-857f-7f09c90557ff	1	3	f	\N
58f4560f-2ee9-45d1-a675-41fbd5191596	19590b32-f3c9-407b-a390-dc9e6ce7d402	327f9bbe-1686-4459-a5c2-ec2c48af5023	1	1	f	\N
376e112f-6e76-4f1c-8b80-249721db7d5f	19590b32-f3c9-407b-a390-dc9e6ce7d402	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	1	2	f	\N
3ddf89e0-dcf2-4dd0-88ad-5c3a0035ca76	19590b32-f3c9-407b-a390-dc9e6ce7d402	a27689aa-6f73-4149-8cce-717d0e89d9e0	0.5	3	f	\N
c06497e7-14c5-47fa-a2c2-8db66387d9fb	19590b32-f3c9-407b-a390-dc9e6ce7d402	35d09fee-3fe5-4842-a365-8e89d4c17156	0.5	4	f	\N
2d495073-cad3-438e-8b2a-aa71056276c8	19590b32-f3c9-407b-a390-dc9e6ce7d402	6c77a7d7-357c-441c-8e62-5a5cb68da019	6	5	f	\N
95fe8963-678d-4377-b450-def46997d86a	733ce150-615d-4aa6-9928-6b0c6aa414c8	833f71a6-6995-4a78-9e09-a1bd97ddcc1c	30	1	f	\N
3841eb80-8b27-4368-a6fb-e4e73b30dea4	733ce150-615d-4aa6-9928-6b0c6aa414c8	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
73a78458-8092-441d-91c0-c74215a3c931	733ce150-615d-4aa6-9928-6b0c6aa414c8	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
78ba74fb-76ee-473e-a5f8-6df2cb3dd9b1	e7aff52a-d7ca-4034-9be1-6696396f1a23	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
a73583be-146d-43ea-8038-e24218f9bc53	2ede58f1-6e3e-46a7-bc26-ba426d5422ec	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
1aa4fb92-0b25-4730-8a18-34d9b6f0c9ae	2ede58f1-6e3e-46a7-bc26-ba426d5422ec	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	0	2	t	75 kg/campo
cf9781bf-f463-48f0-9431-92de1d8cc628	2ede58f1-6e3e-46a7-bc26-ba426d5422ec	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	0	3	t	5 kg/campo
a7adef34-3613-457c-afd4-e268e5964563	2ede58f1-6e3e-46a7-bc26-ba426d5422ec	4245263e-261a-4c24-857f-7f09c90557ff	1	4	f	\N
4c0dc42f-064b-4401-94fa-ba8d526e98c1	bde2881a-a8e5-46d4-a2b4-f3a054afb0d3	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	0	1	t	7,5 kg/campo
a8cfa2fc-586b-4613-893f-ea2faf78abf2	bde2881a-a8e5-46d4-a2b4-f3a054afb0d3	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	0	2	t	2,5 kg/campo
8d74acc9-b875-4968-8842-5e648d1b9514	2dc6270a-155e-4c0e-845e-7456f4424778	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
9ad9d1f7-f6d3-4343-874b-a39561bfa998	2dc6270a-155e-4c0e-845e-7456f4424778	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	0	2	t	75 kg/campo
cea26c9e-0473-4e75-87f6-005956447c05	2dc6270a-155e-4c0e-845e-7456f4424778	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	0	3	t	5 kg/campo
1dac59f9-870d-4173-847a-ba704a2a7d09	2dc6270a-155e-4c0e-845e-7456f4424778	4245263e-261a-4c24-857f-7f09c90557ff	1	4	f	\N
7ae182ea-d565-4309-ab6d-7cdb61322e96	18b2d881-e6bf-4008-90c6-2b975c37801f	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	0	1	t	7,5 kg/campo
5c56b699-7790-48c2-8fb4-423bada47e72	18b2d881-e6bf-4008-90c6-2b975c37801f	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	0	2	t	2,5 kg/campo
35dfa4e3-a10b-4cb1-a77e-d6d676b0ebd2	1a298530-1f78-47d6-bc84-1f1bb7016e18	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
43aea33b-3ae4-4f6e-be20-255813f7173d	1a298530-1f78-47d6-bc84-1f1bb7016e18	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	0	2	t	75 kg/campo
fc796299-0c1e-4d74-a813-fbcba5e0093e	1a298530-1f78-47d6-bc84-1f1bb7016e18	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	0	3	t	5 kg/campo
bcac2270-b395-4dd2-a78e-71b8abbb0fc7	1a298530-1f78-47d6-bc84-1f1bb7016e18	4245263e-261a-4c24-857f-7f09c90557ff	1	4	f	\N
b9ea3350-da33-4895-9f44-94e51776075e	6fdbe2c2-a158-4132-a1e6-7a3c59fc7447	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
9f94a9bf-3835-4e5d-8e06-9fafb3eb6244	38f2645c-aba1-4df1-9a70-b4a63589217a	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
926abf46-8dd2-4ffd-9588-a77101cc1cef	4beb932b-0d1a-48cb-9697-2ea8a54fe4ce	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
a0db1ab5-7939-4a74-802c-d504ea16f114	8eb0d9a9-520d-4296-9209-39b8a1b3fbdb	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
ad8f4ed1-db1b-4f69-9551-b1aaa6915127	3a810895-eb46-4a3a-85ac-280bfc8a6eaa	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
20d753ad-9c63-4af9-8f32-c977b6da85c0	3a810895-eb46-4a3a-85ac-280bfc8a6eaa	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
bbe093b0-70ec-461b-8aed-d9f8773a3f03	3a810895-eb46-4a3a-85ac-280bfc8a6eaa	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
6b42a8bf-904d-4001-a117-57011777d98b	624ebc73-ee42-4f1e-b46b-47287a0ec698	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
0878df56-b059-4ca2-b48a-38985114ec85	624ebc73-ee42-4f1e-b46b-47287a0ec698	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
9902dde5-8a61-464e-b342-891fcd5bef61	27d7f751-a81c-4d13-9429-af50fc53385a	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
c4915f2d-6a21-4efe-aa9d-d6dd77ae2418	27d7f751-a81c-4d13-9429-af50fc53385a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
dc8eba77-fa64-4e79-8fdc-4cacaa6c6c6d	27d7f751-a81c-4d13-9429-af50fc53385a	607c6808-635d-4174-92ab-4893ac1f75cb	1	3	f	\N
4a031e48-0381-49ec-8ec1-d6bd6042ef04	cde1b3f2-bbde-4428-b6f0-38aafc462015	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
ad4c422e-490d-428f-a764-e7d2d4269ceb	4a06bff9-1c40-4dc5-9b02-b6559003468b	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
313e5bdd-312a-4730-9852-95eb2b4aedc5	4a06bff9-1c40-4dc5-9b02-b6559003468b	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
99551379-5661-451e-afc5-ef496421d964	4a06bff9-1c40-4dc5-9b02-b6559003468b	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	3	f	\N
a47760d4-e71d-49ae-98d1-ce618c7374ff	46973b67-a8f2-4ad8-a4d1-9b59197e124a	44296fb4-8459-4a5b-ad35-492e509f09db	35	1	f	\N
4ac34b67-6d7f-4909-b17b-356878a7593b	46973b67-a8f2-4ad8-a4d1-9b59197e124a	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
02b9be56-a534-499f-af72-03d86887fa64	46973b67-a8f2-4ad8-a4d1-9b59197e124a	4245263e-261a-4c24-857f-7f09c90557ff	1	3	f	\N
90b163a7-35d8-4734-8d34-1b4061b2713c	617c4f6d-3f0f-4e1f-a031-1ff61dad6808	327f9bbe-1686-4459-a5c2-ec2c48af5023	1	1	f	\N
3ed58780-67dc-4b02-a8a6-dbc2d058c7b8	617c4f6d-3f0f-4e1f-a031-1ff61dad6808	cd8027cb-5de9-4f9a-b786-a92ac7e42aca	1	2	f	\N
12da8ac5-137c-484b-8828-b44ba5839c06	617c4f6d-3f0f-4e1f-a031-1ff61dad6808	a27689aa-6f73-4149-8cce-717d0e89d9e0	0.5	3	f	\N
66b11b81-19f2-4692-9116-e3971e5d1150	617c4f6d-3f0f-4e1f-a031-1ff61dad6808	35d09fee-3fe5-4842-a365-8e89d4c17156	0.5	4	f	\N
c5c02c0c-c431-4b1d-b6d3-ebe2adb1db40	617c4f6d-3f0f-4e1f-a031-1ff61dad6808	6c77a7d7-357c-441c-8e62-5a5cb68da019	6	5	f	\N
d780a0da-2dca-4eec-bc4f-2bd851cbc7b9	14730732-c080-4a2f-9d04-1b74c467183c	b1928501-0303-481f-9126-76c543bd7b6b	40	1	f	\N
a5aa7c65-6399-42e1-9f8d-09d0bcd51b3d	14730732-c080-4a2f-9d04-1b74c467183c	504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	20	2	f	\N
f8cc27be-023c-4475-9d8b-4eac2f8d2463	14730732-c080-4a2f-9d04-1b74c467183c	ae054e24-2db6-4b98-afe5-0d6d016ff5bb	1	3	f	\N
37003a17-71da-48f8-a488-6e75db377769	001c0b38-c1d4-4488-9df9-01adde09a7f5	44296fb4-8459-4a5b-ad35-492e509f09db	50	1	f	\N
\.


--
-- Data for Name: pv_kit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_kit (id, slug, nome, badge, descrizione, sort_order) FROM stdin;
\.


--
-- Data for Name: pv_kit_prodotti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_kit_prodotti (id, kit_id, prodotto_id, dose_gm2, condizione, nota, sort_order) FROM stdin;
\.


--
-- Data for Name: pv_liquidi_prodotti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_liquidi_prodotti (id, liquido_id, prodotto_id, nome_prodotto, dose, unita) FROM stdin;
\.


--
-- Data for Name: pv_liquidi_programmati; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_liquidi_programmati (id, piano_id, tipo, mese_inizio, mese_fine, frequenza_giorni, attivo, created_at) FROM stdin;
\.


--
-- Data for Name: pv_piani; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_piani (id, slug, label, descrizione, tipo_prato, fase, livello, is_active, sort_order, created_at, linea, terreno, data_inizio, data_fine, esteso_12_mesi, colore_prato) FROM stdin;
973c555b-7c50-40c9-896a-1036eb3e2d56	mantenimento_ornamentale_base	Mantenimento Ornamentale Base	Solo granulare stagionale. Green 7 primavera/autunno, Green 8 pre-estate e novembre.	ornamentale	mantenimento	base	t	30	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
1481c5e3-9bda-466b-a6be-6e15d2e8e56a	mantenimento_ornamentale_standard	Mantenimento Ornamentale Standard	Granulare + Humifitos + Micosat PG. Sistema biologico attivo e nutrizione bilanciata.	ornamentale	mantenimento	standard	t	31	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
e5286c80-97d1-4420-98e3-8852eb4a09eb	mantenimento_ornamentale_premium	Mantenimento Ornamentale Premium	Percorso completo con LeoKare, fogliare estivo e Wet Turf. Il meglio del Metodo PratoVivo.	ornamentale	mantenimento	premium	t	32	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
3b6b8dda-e92f-4f92-97b4-c10ffac9fc65	mantenimento_sportivo_economico	Mantenimento Sportivo Economico	Piano minimo da campo: AllRound granulare + Humifitos e Micosat MO a dose fissa. Approccio cost-effective per grandi superfici.	sportivo	mantenimento	base	t	39	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
ff90b067-eef5-4cdf-b395-b5eb9048d0b1	mantenimento_sportivo_base	Mantenimento Sportivo Base	AllRound CRF + Green 8. Nutrizione stagionale essenziale per prati ad alto calpestio.	sportivo	mantenimento	base	t	40	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
0acdf068-c6b5-485a-9da9-47963e7f47e8	mantenimento_sportivo_standard	Mantenimento Sportivo Standard	AllRound + Humifitos + Micosat PG. Terreno sportivo biologicamente attivo.	sportivo	mantenimento	standard	t	41	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
0224846d-0162-4a9c-9860-627df27a5ce4	mantenimento_sportivo_premium	Mantenimento Sportivo Premium	Percorso sportivo completo con Micosat MO, LeoKare, fogliare estivo e Wet Turf.	sportivo	mantenimento	premium	t	42	2026-03-04 19:27:45.398423+00	albatros	normale	\N	\N	f	\N
19ed8a3c-30b6-46be-9ef4-4969131a08aa	nuova_semina_ornamentale_base	Nuova Semina Ornamentale Base	Prato non esistente: preparazione, semina con rullo liscio, Vigor Active. Solo granulare, senza liquidi.	ornamentale	nuova_semina	base	t	10	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
de382757-6743-4ac3-93b3-a935bdaec626	nuova_semina_ornamentale_standard	Nuova Semina Ornamentale Standard	Preparazione, semina, Vigor Active post-semina, irrorazione Humifitos + Micosat F + Root Speed.	ornamentale	nuova_semina	standard	t	11	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
63174bbb-1e96-47bc-8430-a052887203ce	nuova_semina_ornamentale_premium	Nuova Semina Ornamentale Premium	Ciclo completo post-semina: Vigor Active + Humifitos + Micosat F + Root Speed + Wet Turf + Algapark.	ornamentale	nuova_semina	premium	t	12	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
c1d60297-7e51-443b-97a6-6837f2f96a50	nuova_semina_sportivo_base	Nuova Semina Sportivo Base	Prato sportivo non esistente: preparazione, semina con rullo liscio, Vigor Active. Solo granulare, senza liquidi.	sportivo	nuova_semina	base	t	20	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
f4752518-fc86-47a1-a74a-c6f641401730	nuova_semina_sportivo_standard	Nuova Semina Sportivo Standard	Preparazione, semina, Vigor Active post-semina, irrorazione Humifitos + Micosat F + Root Speed.	sportivo	nuova_semina	standard	t	21	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
a309f617-5fdd-4777-9f70-e79d949dd277	nuova_semina_sportivo_premium	Nuova Semina Sportivo Premium	Ciclo completo post-semina: Vigor Active + Humifitos + Micosat F + Root Speed + Wet Turf + Algapark.	sportivo	nuova_semina	premium	t	22	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
503274e5-16d1-43ed-a131-2fc609a91a14	rigenerazione_ornamentale_base	Rigenerazione Ornamentale Base	Taglio + arieggiatura + semina con rullo chiodato + Vigor Active post-semina. Solo granulare.	ornamentale	rigenerazione	base	t	50	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
01ea4c12-799e-442d-be45-cdd8c70a7410	rigenerazione_ornamentale_standard	Rigenerazione Ornamentale Standard	Taglio + arieggiatura + semina + Vigor Active + irrorazione Humifitos + Micosat F + Root Speed.	ornamentale	rigenerazione	standard	t	51	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
30ae6bd7-374a-4219-a9f8-f5e7fb1e5809	rigenerazione_ornamentale_premium	Rigenerazione Ornamentale Premium	Ciclo completo: Vigor Active + Humifitos + Micosat F + Root Speed + Wet Turf + Algapark post-semina.	ornamentale	rigenerazione	premium	t	52	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
071a2e49-c0d3-41b0-985d-e68ca8ba714b	rigenerazione_sportivo_base	Rigenerazione Sportivo Base	Taglio + arieggiatura + semina con rullo chiodato + Vigor Active post-semina. Solo granulare.	sportivo	rigenerazione	base	t	53	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
a6a10680-bd23-4250-982e-8d6e93d85054	rigenerazione_sportivo_standard	Rigenerazione Sportivo Standard	Taglio + arieggiatura + semina + Vigor Active + irrorazione Humifitos + Micosat F + Root Speed.	sportivo	rigenerazione	standard	t	54	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
f7d9eafc-5b10-4d77-ab94-ddd4c3531936	rigenerazione_sportivo_premium	Rigenerazione Sportivo Premium	Ciclo completo: Vigor Active + Humifitos + Micosat F + Root Speed + Wet Turf + Algapark post-semina.	sportivo	rigenerazione	premium	t	55	2026-03-05 21:26:23.433344+00	albatros	normale	\N	\N	f	\N
\.


--
-- Data for Name: pv_preventivi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_preventivi (id, numero, cliente_nome, cliente_ref, piano_id, superficie_m2, tipo_prato, listino, totale_euro, note, stato, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pv_preventivo_righe; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_preventivo_righe (id, preventivo_id, prodotto_id, qta_kg, prezzo_unit, totale, sort_order) FROM stdin;
\.


--
-- Data for Name: pv_prodotti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pv_prodotti (id, listino_codice, listino_brand, slug, tipo, icona, is_liquido, dose_std_gm2, dose_sport_mult, note_tecniche, is_active, created_at, linea, su_ordinazione) FROM stdin;
833f71a6-6995-4a78-9e09-a1bd97ddcc1c	G7025	GEOGREEN	green7	granulare	🟢	f	32	1.2	Risveglio e crescita attiva. Durata ~2 mesi.	t	2026-03-04 08:27:15.563749+00	\N	f
44296fb4-8459-4a5b-ad35-492e509f09db	G8025	GEOGREEN	green8	granulare	🟢	f	35	1.2	Anti-stress estivo e autunnale. Alto K. Durata ~3 mesi.	t	2026-03-04 08:27:15.563749+00	\N	f
cb7d215c-f5c8-48b4-9db9-829bf97d1cb7	VA025	GEOGREEN	vigor_active	granulare	🟢	f	25	1.2	Starter pre-semina con Bacillus subtilis.	t	2026-03-04 08:27:15.563749+00	\N	f
4938516c-536f-42fc-a52f-d18bf5d806a4	MGP010	GEOGREEN	universal_top	granulare	🔵	f	25	1.2	CRF 12-16 sett. 40% N ricoperto. Primavera/autunno.	t	2026-03-04 08:27:15.563749+00	\N	f
6753ead9-3c9c-48b3-93a1-b472a68aa14c	MGE080	GEOGREEN	pro_starter	granulare	🔵	f	35	1.2	Alto P 16-25-12. Semina/trasemina/posa zolle.	t	2026-03-04 08:27:15.563749+00	\N	f
16dc6013-7be3-45b1-a2e0-8ae5ac0f17bd	MGE110	GEOGREEN	pro_slow	granulare	🔵	f	30	1.2	CRF 5-6 mesi. Applicazione singola lunga stagione.	t	2026-03-04 08:27:15.563749+00	\N	f
91ed3595-1628-4298-a61d-e54d7e89f92a	MGR040	GEOGREEN	iron_power	granulare	🔵	f	20	1.2	SRF 2-3 mesi. Alto Fe+MgO. Zone ombra/ristagno.	t	2026-03-04 08:27:15.563749+00	\N	f
a6ba6c4c-3261-4fd0-9541-af1ca287e31c	MGS010	GEOGREEN	granustar	granulare	🔵	f	20	1.2	SRF microgranulo. Green golf e tappeti fini.	t	2026-03-04 08:27:15.563749+00	\N	f
4b5f0a8f-912d-4a75-839f-c223c7d92cb1	PRO005	GEOGREEN	root_speed	radicante	🟣	t	0.5	1.2	P₂O₅ 30% +MgO +Zn. Post-semina, post-rigenerazione. Agisce a basse temperature.	t	2026-03-04 08:27:15.563749+00	\N	f
327f9bbe-1686-4459-a5c2-ec2c48af5023	PFE001	GEOGREEN	fe_ulk	fogliare	🔴	t	0.3	1.2	Fe 5% complessato aminoacidi. Rinverdimento rapido.	t	2026-03-04 08:27:15.563749+00	\N	f
0acaaf87-b7ad-49c9-a863-36661cc03c34	PAM001	GEOGREEN	amino_k	biostimolante	🩵	t	0.3	1.2	Aminoacidi levogiri 44,5%. Anti-stress, posticipa dormienza.	t	2026-03-04 08:27:15.563749+00	\N	f
454a60e5-04a0-4243-a6ff-acb61344f295	TNK005	GEOGREEN	npk_enduring	fogliare	🔴	t	\N	1.2	NPK 10-5-7 liquido. Fertirrigazione mantenimento.	t	2026-03-04 08:27:15.563749+00	\N	f
f7f979db-47dc-43fc-88f7-5d5225a185ce	PDV001	GEOGREEN	decal_vyro	coadiuvante	⚗️	t	\N	1.2	Acidificante. Da aggiungere a tutti i trattamenti fogliari.	t	2026-03-04 08:27:15.563749+00	\N	f
4245263e-261a-4c24-857f-7f09c90557ff	WETU01	GEOGREEN	wet_turf	umettante	🔷	t	1	1.2	Umettante estivo. Previene dry-spot. 2-4 appl/mese estate.	t	2026-03-04 08:27:15.563749+00	\N	f
14548325-90bc-43f5-8373-43c768fdb928	PATU005	GEOGREEN	paint_turf	coadiuvante	🎨	f	\N	1.2	Pigmento naturale rinverdente. Ornamentale 400g/1000m².	t	2026-03-04 08:27:15.563749+00	\N	f
607c6808-635d-4174-92ab-4893ac1f75cb	MICOPG1	GEOGREEN	micosat_pg	micorrize	🟣	f	1	1.2	Micosat F Prati & Giardini. Consorzio microbico base.	t	2026-03-04 08:27:15.563749+00	\N	f
ae054e24-2db6-4b98-afe5-0d6d016ff5bb	MICOMO5	GEOGREEN	micosat_mo	micorrize	🟣	f	1	1.2	Micosat F MO. Consorzio professionale avanzato.	t	2026-03-04 08:27:15.563749+00	\N	f
a27689aa-6f73-4149-8cce-717d0e89d9e0	MICOTP1	GEOGREEN	micosat_tab	micorrize	🟣	f	1	1.2	Micosat F Tab Plus. Miscibile in acqua.	t	2026-03-04 08:27:15.563749+00	\N	f
35d09fee-3fe5-4842-a365-8e89d4c17156	MICOL1	GEOGREEN	micosat_len	micorrize	🟣	f	1	1.2	Micosat F Len. Polvere bagnabile.	t	2026-03-04 08:27:15.563749+00	\N	f
02bdb1b6-d139-4cd7-93c6-1123f2279091	MICOU02	GEOGREEN	micosat_uno	micorrize	🟣	f	1	1.2	Micosat F Uno. Gr.200.	t	2026-03-04 08:27:15.563749+00	\N	f
562a2c48-8aa2-42b1-b5ac-029b5a886c34	SHUR005	GEOGREEN	hurricane	seme	🌱	f	40	1.2	Festuca 80% sviluppo orizzontale + CT7 + Poa. Ornamentale pregio. Sole e ombra.	t	2026-03-04 08:27:15.563749+00	\N	f
59071d55-ae52-48fb-ab5b-92eb5e72c2c2	SHUR701	GEOGREEN	hurricane_7	seme	🌱	f	40	1.2	Hurricane 7 kg. Formato professionale.	t	2026-03-04 08:27:15.563749+00	\N	f
f93970ea-e2b2-4b9d-80f6-3cc5a57df104	SSTR01	GEOGREEN	strong	seme	🌱	f	40	1.2	Festuca cespitosa 75% + LP + Poa. Rustico, economico. Sole e ombra.	t	2026-03-04 08:27:15.563749+00	\N	f
2b6d519a-0359-44c5-b2f4-31345fa42143	SBLI01	GEOGREEN	blizzard	seme	🌱	f	40	1.2	Festuca 90% + Poa. Purezza 0/0. Sole e ombra.	t	2026-03-04 08:27:15.563749+00	\N	f
b2b926a4-9866-4f28-a42a-d9d2c70c4241	SREN01-SP	GEOGREEN	renovate_sport	seme	🌱	f	40	1.2	Loietto 93%. Rigenerazione rapida. Sportivo. Solo sole pieno.	t	2026-03-04 08:27:15.563749+00	\N	f
9ce21ac0-8f43-4db3-a4df-6c93ef5f2ace	SWIN01	GEOGREEN	winter_sport	seme	🌱	f	40	1.2	LP + Lolium multiflorum. Rigenerazione invernale. Suolo <10°C.	t	2026-03-04 08:27:15.563749+00	\N	f
a68d8f36-3cd2-46d2-a0e1-ec7ef8f8c6de	STWR01	GEOGREEN	twister	seme	🌱	f	40	1.2	Calpestio intenso. Sole e ombra.	t	2026-03-04 08:27:15.563749+00	\N	f
c191a6f1-9391-4540-ac29-ab5178a9ab59	STOR01	GEOGREEN	tornado	seme	🌱	f	40	1.2	Festuca 80% portamento allargato. Autorigenerante.	t	2026-03-04 08:27:15.563749+00	\N	f
2c3525b4-f8b4-4049-9368-3dfd32f8b917	SNOS01	GEOGREEN	no_sun	seme	🌱	f	40	1.2	Ombra densa. Taglio consigliato >5cm.	t	2026-03-04 08:27:15.563749+00	\N	f
b1928501-0303-481f-9126-76c543bd7b6b	MGP080	GEOGREEN	allround	granulare	🔵	f	25	1.2	CRF bilanciato 18-7-15. 3-4 mesi. Ideale sportivo.	t	2026-03-04 08:27:15.563749+00	mivena	f
504c5bfe-9e6a-4b0c-b68a-cf9265171cfe	PHU025	GEOGREEN	humifitos	biologico	🟤	t	20	1.2	C+N+K organico, aminoacidi. Attiva microflora, degrada feltro. "La borlanda".	t	2026-03-04 08:27:15.563749+00	kare	f
6c77a7d7-357c-441c-8e62-5a5cb68da019	PLK005	GEOGREEN	leokare	biologico	🟤	t	15	1.2	Acidi umici leonardite. Più raffinato di Humifitos, efficace anche fogliare a temp. medie.	t	2026-03-04 08:27:15.563749+00	kare	f
cd8027cb-5de9-4f9a-b786-a92ac7e42aca	PAL005	GEOGREEN	algapark	biostimolante	🩵	t	0.3	1.2	Ecklonia maxima + lievito. Stimola accestimento, inibisce dominanza apicale.	t	2026-03-04 08:27:15.563749+00	kare	f
50638bb4-185c-443a-a67a-efe0f05b788f	PSK001	GEOGREEN	sevenkare	fogliare	🔴	t	\N	1.2	NPK 12-5-6 liquido. Integra Green 7 in fertirrigazione.	t	2026-03-04 08:27:15.563749+00	kare	f
\.


--
-- Data for Name: stock_thresholds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_thresholds (id, brand, model, min_quantity, created_at, updated_at) FROM stdin;
41c82b47-f46d-41d5-a5ae-4704adfeb172	STIHL	Tagliabordi FSA 30.0	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
f17ccbd0-a723-42a7-9a57-fd5c733bc9db	VOLPI	Potatore KVS8000	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
01462346-8562-48fc-899f-db9177cde5a0	STIHL	Batteria AS 2	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
bb9505fb-8089-484d-88c4-1411e8573464	VOLPI	Potatore KVS6000	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
11125724-522e-41f4-a493-8f2d828b38ec	STIHL	AL 101	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
e02e8003-d32a-40b8-91f7-a9538de94cb4	STIHL	Batteria AK 30.0S	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
1c7a3b8c-7c4e-4180-b1b9-fd545c47ba21	STIHL	Soffiatore BGA 50.0	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
b016b2cd-09f2-4715-8238-79ef22470fec	NEGRI	Biotrituratore R95BRAHP65	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
1480997f-59f6-4a44-beb7-bb385b82ef7c	VOLPI	Forbice elettronica KV390	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
2310225e-051c-41bd-ac4e-063e2fea01f9	Echo	Motosega CS-280TES	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
b02cc06b-c7ce-4b22-919e-850bccedebe2	Honda	Tosaerba HRN536C2 VYEH	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
7bd56fda-a4eb-4d40-bdf7-b0e55e099b7e	Volpi	Decespugliatore Ciao	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
d3f647b9-930a-4b0a-9259-2be529b745ef	STIHL	Motosega MS 194 T 1/4 P Chainsaw	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
21f823e2-375a-4a0d-87b2-d98c3a777a67	Volpi	Forbice elettronica KV360	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
f2c47f08-1eeb-4ebf-9eec-6470c2bd13df	STIHL	Tosaerba RMA 239.1	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
c64855cf-b6ac-46b8-b29a-814d64ddea83	STIHL	AL101(EU)	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
aca3d1b9-9b26-420c-83e6-8d12de62e09f	STIHL	Decespugliatore FSA 60 R	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
6d3db9db-6ad7-4f1a-bf09-1e732ccc3779	STIHL	Caricabatterie AL 101	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
1e382019-a2a3-4e84-bb55-fa99248b3999	STIHL	Decespugliatore FSA 80 R	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
1a866402-b5b8-417c-a1d5-ff04106c5c01	Honda	HRX537C7 HZEH	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
fe86f2ea-1117-4c88-9568-5eda229832be	STIHL	MSA 161 T	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
beb20c6a-a8f1-43fa-88a2-535ace4f3328	Honda	Tosaerba HRG466C1 SKEP	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
bbb1ad09-4ede-41bd-88e3-5bda81e9bc00	STIHL	Troncatrice TS 910.0i, 400mm/16"	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
f2ffddb9-2333-4d27-b621-815fe9399a27	STIHL	AK 30.0S	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
bf4d92c7-e787-4b20-bf61-97f0b1018d7f	Stihl	Atomizzatore SR 430 Mistblower	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
266fb97c-2c39-4734-b37c-2f615e1a22f6	STIHL	Tagliabordi FSA 50.0	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
faeba3e3-3a29-4b47-a8df-faec57b6ea77	STIHL	Motosega MSA 190.0 T	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
bd4ce7b9-e8ca-43db-8870-30de84f4a40c	STIHL	RM 248.3 T	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
0df19a3d-98e1-4877-a8ff-623614ecdd78	STIHL	Caricabatterie AL 1	1	2026-03-03 16:43:19.843165+00	2026-03-03 16:43:19.843165+00
f74f36e6-6bbf-43c5-aa20-1564b8573e80	Honda	Motozappa F220K1 GET2	1	2026-03-05 10:21:49.69972+00	2026-03-05 10:21:49.69972+00
88ff57c6-7bfe-4fc1-90b4-8abe734e81d3			1	2026-03-05 12:54:47.085658+00	2026-03-05 12:54:47.085658+00
7969cbf3-1c78-4b0d-83a6-e982132c6925	STIHL	Potatore HTA 86	1	2026-03-06 10:19:38.354988+00	2026-03-06 10:19:38.354988+00
bdb8b6d4-9590-4000-98d7-164c813a0dc3	STIHL	Batteria AP 500 S	1	2026-03-06 10:54:23.074001+00	2026-03-06 10:54:23.074001+00
2e700578-c4b2-48bd-80a9-0618571c7da0	STIHL	Batteria AP 300.0 S (281 Wh)	1	2026-03-06 10:55:35.120594+00	2026-03-06 10:55:35.120594+00
9c6784fa-2d9a-4d61-b6bc-39f0fe4af7d4	STIHL	Batteria AP 300.0 S	1	2026-03-06 10:55:57.234429+00	2026-03-06 10:55:57.234429+00
b895ba93-5602-4fd1-a183-d43e615b16e7	STIHL	 MSA 60.C	1	2026-03-06 17:28:37.060786+00	2026-03-06 17:28:37.060786+00
35feedce-01a2-4e2c-97e0-8c53ebd2e24b	STIHL	 MSA 70.0 C	1	2026-03-07 08:33:52.669466+00	2026-03-07 08:33:52.669466+00
1889454e-2fa4-42d6-ac98-b1e272d6ca96	STIHL	 AK 20	1	2026-03-07 08:34:21.265988+00	2026-03-07 08:34:21.265988+00
333548d5-3085-4aab-91b2-5eefcacab009	STIHL	 AL 101	1	2026-03-07 08:35:15.706727+00	2026-03-07 08:35:15.706727+00
67e546f2-b0b4-42f5-835a-8ffcedc30a90	STIHL	 HSA 60.1	1	2026-03-07 08:41:38.083383+00	2026-03-07 08:41:38.083383+00
84d0cc8d-8231-4af9-9b24-b648dba4e71a	STIGA	Trattorino XDL 210 HD	1	2026-03-09 13:14:20.504727+00	2026-03-09 13:14:20.504727+00
9f14c2ed-c9f9-4bd8-ada0-c97890db4943	STIGA	Trattorino XD 150 HD	1	2026-03-09 13:15:28.264836+00	2026-03-09 13:15:28.264836+00
c6cf220d-8046-4603-8399-4d20160133f7	STIGA	Trattorino XF 135 HD	1	2026-03-09 13:17:45.333938+00	2026-03-09 13:17:45.333938+00
5674a0fc-586f-4ae8-ad5f-793b3a92f700	STIGA	Trattorino XDC 150 HD	1	2026-03-09 13:21:53.332907+00	2026-03-09 13:21:53.332907+00
\.


--
-- Data for Name: messages_2026_03_06; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_06 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_07; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_07 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_08; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_08 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_09; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_09 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_10; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_10 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_11; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_11 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_12; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_12 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-12-24 22:54:49
20211116045059	2025-12-24 22:54:52
20211116050929	2025-12-24 22:54:53
20211116051442	2025-12-24 22:54:55
20211116212300	2025-12-24 22:54:57
20211116213355	2025-12-24 22:54:59
20211116213934	2025-12-24 22:55:00
20211116214523	2025-12-24 22:55:02
20211122062447	2025-12-24 22:55:04
20211124070109	2025-12-24 22:55:06
20211202204204	2025-12-24 22:55:07
20211202204605	2025-12-24 22:55:09
20211210212804	2025-12-24 22:55:14
20211228014915	2025-12-24 22:55:16
20220107221237	2025-12-24 22:55:17
20220228202821	2025-12-24 22:55:19
20220312004840	2025-12-24 22:55:21
20220603231003	2025-12-24 22:55:23
20220603232444	2025-12-24 22:55:25
20220615214548	2025-12-24 22:55:27
20220712093339	2025-12-24 22:55:28
20220908172859	2025-12-24 22:55:30
20220916233421	2025-12-24 22:55:32
20230119133233	2025-12-24 22:55:33
20230128025114	2025-12-24 22:55:36
20230128025212	2025-12-24 22:55:37
20230227211149	2025-12-24 22:55:39
20230228184745	2025-12-24 22:55:40
20230308225145	2025-12-24 22:55:42
20230328144023	2025-12-24 22:55:44
20231018144023	2025-12-24 22:55:46
20231204144023	2025-12-24 22:55:48
20231204144024	2025-12-24 22:55:50
20231204144025	2025-12-24 22:55:52
20240108234812	2025-12-24 22:55:53
20240109165339	2025-12-24 22:55:55
20240227174441	2025-12-24 22:55:58
20240311171622	2025-12-24 22:56:00
20240321100241	2025-12-24 22:56:04
20240401105812	2025-12-24 22:56:08
20240418121054	2025-12-24 22:56:10
20240523004032	2025-12-24 22:56:16
20240618124746	2025-12-24 22:56:18
20240801235015	2025-12-24 22:56:19
20240805133720	2025-12-24 22:56:21
20240827160934	2025-12-24 22:56:23
20240919163303	2025-12-24 22:56:25
20240919163305	2025-12-24 22:56:27
20241019105805	2025-12-24 22:56:28
20241030150047	2025-12-24 22:56:34
20241108114728	2025-12-24 22:56:37
20241121104152	2025-12-24 22:56:38
20241130184212	2025-12-24 22:56:40
20241220035512	2025-12-24 22:56:42
20241220123912	2025-12-24 22:56:44
20241224161212	2025-12-24 22:56:45
20250107150512	2025-12-24 22:56:47
20250110162412	2025-12-24 22:56:48
20250123174212	2025-12-24 22:56:50
20250128220012	2025-12-24 22:56:52
20250506224012	2025-12-24 22:56:53
20250523164012	2025-12-24 22:56:55
20250714121412	2025-12-24 22:56:56
20250905041441	2025-12-24 22:56:58
20251103001201	2025-12-24 22:56:59
20251120212548	2026-02-04 12:50:11
20251120215549	2026-02-04 12:50:11
20260218120000	2026-02-27 12:19:38
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-24 22:54:47.095234
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-24 22:54:47.110062
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-24 22:54:47.144701
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-24 22:54:47.208155
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-24 22:54:47.212426
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-24 22:54:47.225376
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-24 22:54:47.229995
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-24 22:54:47.248265
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-24 22:54:47.253562
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-24 22:54:47.259189
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-24 22:54:47.263827
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-24 22:54:47.288568
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-24 22:54:47.293155
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-24 22:54:47.297681
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-24 22:54:47.302168
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-24 22:54:47.307958
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-24 22:54:47.313282
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-24 22:54:47.319763
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-24 22:54:47.333728
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-24 22:54:47.345068
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-24 22:54:47.349499
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-24 22:54:47.354248
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-24 22:54:47.937201
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-24 22:54:47.981004
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-24 22:54:47.98543
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-24 22:54:47.99542
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-24 22:54:48.00111
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2025-12-24 22:54:48.019265
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2025-12-24 22:54:47.114321
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2025-12-24 22:54:47.21746
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2025-12-24 22:54:47.234832
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2025-12-24 22:54:47.242843
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2025-12-24 22:54:47.358783
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2025-12-24 22:54:47.371522
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2025-12-24 22:54:47.888722
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2025-12-24 22:54:47.893513
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2025-12-24 22:54:47.898184
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2025-12-24 22:54:47.904655
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2025-12-24 22:54:47.911774
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2025-12-24 22:54:47.918479
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2025-12-24 22:54:47.920361
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2025-12-24 22:54:47.9262
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2025-12-24 22:54:47.930491
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2025-12-24 22:54:47.941807
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2025-12-24 22:54:47.952246
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2025-12-24 22:54:47.957188
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2025-12-24 22:54:47.96501
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2025-12-24 22:54:47.97029
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2025-12-24 22:54:47.976185
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2025-12-24 22:54:48.005288
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-02-14 14:26:17.330702
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-02-14 14:26:17.401048
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-02-14 14:26:17.402656
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-02-14 14:26:17.43394
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-02-14 14:26:17.43581
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-02-14 14:26:17.437259
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-02-14 14:26:17.444531
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_id_seq', 276, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 2989, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: app_config app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_pkey PRIMARY KEY (key);


--
-- Name: clienti clienti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clienti
    ADD CONSTRAINT clienti_pkey PRIMARY KEY (id);


--
-- Name: clienti clienti_search_text_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clienti
    ADD CONSTRAINT clienti_search_text_unique UNIQUE (search_text);


--
-- Name: commissioni commissioni_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissioni
    ADD CONSTRAINT commissioni_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: listini listini_brand_codice_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listini
    ADD CONSTRAINT listini_brand_codice_key UNIQUE (brand, codice);


--
-- Name: listini_log listini_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listini_log
    ADD CONSTRAINT listini_log_pkey PRIMARY KEY (id);


--
-- Name: listini listini_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listini
    ADD CONSTRAINT listini_pkey PRIMARY KEY (id);


--
-- Name: operatori operatori_nome_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatori
    ADD CONSTRAINT operatori_nome_key UNIQUE (nome);


--
-- Name: operatori operatori_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatori
    ADD CONSTRAINT operatori_pkey PRIMARY KEY (id);


--
-- Name: pricing_policies pricing_policies_brand_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_policies
    ADD CONSTRAINT pricing_policies_brand_key UNIQUE (brand);


--
-- Name: pricing_policies pricing_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_policies
    ADD CONSTRAINT pricing_policies_pkey PRIMARY KEY (id);


--
-- Name: pv_interventi pv_interventi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_interventi
    ADD CONSTRAINT pv_interventi_pkey PRIMARY KEY (id);


--
-- Name: pv_intervento_prodotti pv_intervento_prodotti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_intervento_prodotti
    ADD CONSTRAINT pv_intervento_prodotti_pkey PRIMARY KEY (id);


--
-- Name: pv_kit pv_kit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_kit
    ADD CONSTRAINT pv_kit_pkey PRIMARY KEY (id);


--
-- Name: pv_kit_prodotti pv_kit_prodotti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_kit_prodotti
    ADD CONSTRAINT pv_kit_prodotti_pkey PRIMARY KEY (id);


--
-- Name: pv_kit pv_kit_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_kit
    ADD CONSTRAINT pv_kit_slug_key UNIQUE (slug);


--
-- Name: pv_liquidi_prodotti pv_liquidi_prodotti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_liquidi_prodotti
    ADD CONSTRAINT pv_liquidi_prodotti_pkey PRIMARY KEY (id);


--
-- Name: pv_liquidi_programmati pv_liquidi_programmati_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_liquidi_programmati
    ADD CONSTRAINT pv_liquidi_programmati_pkey PRIMARY KEY (id);


--
-- Name: pv_piani pv_piani_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_piani
    ADD CONSTRAINT pv_piani_pkey PRIMARY KEY (id);


--
-- Name: pv_piani pv_piani_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_piani
    ADD CONSTRAINT pv_piani_slug_key UNIQUE (slug);


--
-- Name: pv_preventivi pv_preventivi_numero_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivi
    ADD CONSTRAINT pv_preventivi_numero_key UNIQUE (numero);


--
-- Name: pv_preventivi pv_preventivi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivi
    ADD CONSTRAINT pv_preventivi_pkey PRIMARY KEY (id);


--
-- Name: pv_preventivo_righe pv_preventivo_righe_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivo_righe
    ADD CONSTRAINT pv_preventivo_righe_pkey PRIMARY KEY (id);


--
-- Name: pv_prodotti pv_prodotti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_prodotti
    ADD CONSTRAINT pv_prodotti_pkey PRIMARY KEY (id);


--
-- Name: pv_prodotti pv_prodotti_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_prodotti
    ADD CONSTRAINT pv_prodotti_slug_key UNIQUE (slug);


--
-- Name: stock_thresholds stock_thresholds_brand_model_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_thresholds
    ADD CONSTRAINT stock_thresholds_brand_model_unique UNIQUE (brand, model);


--
-- Name: stock_thresholds stock_thresholds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_thresholds
    ADD CONSTRAINT stock_thresholds_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_06 messages_2026_03_06_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_06
    ADD CONSTRAINT messages_2026_03_06_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_07 messages_2026_03_07_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_07
    ADD CONSTRAINT messages_2026_03_07_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_08 messages_2026_03_08_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_08
    ADD CONSTRAINT messages_2026_03_08_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_09 messages_2026_03_09_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_09
    ADD CONSTRAINT messages_2026_03_09_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_10 messages_2026_03_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_10
    ADD CONSTRAINT messages_2026_03_10_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_11 messages_2026_03_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_11
    ADD CONSTRAINT messages_2026_03_11_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_12 messages_2026_03_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_12
    ADD CONSTRAINT messages_2026_03_12_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_clienti_cf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clienti_cf ON public.clienti USING btree (codice_fiscale) WHERE (codice_fiscale IS NOT NULL);


--
-- Name: idx_clienti_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clienti_deleted_at ON public.clienti USING btree (deleted_at);


--
-- Name: idx_clienti_piva; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clienti_piva ON public.clienti USING btree (partita_iva) WHERE (partita_iva IS NOT NULL);


--
-- Name: idx_clienti_search_text; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clienti_search_text ON public.clienti USING btree (search_text);


--
-- Name: idx_commissioni_cliente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_cliente ON public.commissioni USING btree (cliente);


--
-- Name: idx_commissioni_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_created ON public.commissioni USING btree (created_at DESC);


--
-- Name: idx_commissioni_is_preventivo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_is_preventivo ON public.commissioni USING btree (is_preventivo);


--
-- Name: idx_commissioni_privacy_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_privacy_pending ON public.commissioni USING btree (privacy_required, privacy_acknowledged) WHERE ((privacy_required = true) AND (privacy_acknowledged = false));


--
-- Name: idx_commissioni_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_status ON public.commissioni USING btree (status);


--
-- Name: idx_pv_interventi_piano; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pv_interventi_piano ON public.pv_interventi USING btree (piano_id);


--
-- Name: idx_pv_piani_fase; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pv_piani_fase ON public.pv_piani USING btree (fase);


--
-- Name: idx_pv_piani_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pv_piani_slug ON public.pv_piani USING btree (slug);


--
-- Name: idx_pv_preventivi_cliente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pv_preventivi_cliente ON public.pv_preventivi USING btree (cliente_ref);


--
-- Name: idx_pv_prodotti_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pv_prodotti_slug ON public.pv_prodotti USING btree (slug);


--
-- Name: idx_serial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_serial ON public.inventory USING btree ("serialNumber");


--
-- Name: idx_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_status ON public.inventory USING btree (status);


--
-- Name: idx_stock_thresholds_brand_model; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stock_thresholds_brand_model ON public.stock_thresholds USING btree (brand, model);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_06_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_06_inserted_at_topic_idx ON realtime.messages_2026_03_06 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_07_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_07_inserted_at_topic_idx ON realtime.messages_2026_03_07 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_08_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_08_inserted_at_topic_idx ON realtime.messages_2026_03_08 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_09_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_09_inserted_at_topic_idx ON realtime.messages_2026_03_09 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_10_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_10_inserted_at_topic_idx ON realtime.messages_2026_03_10 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_11_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_11_inserted_at_topic_idx ON realtime.messages_2026_03_11 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_12_inserted_at_topic_idx ON realtime.messages_2026_03_12 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: messages_2026_03_06_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_06_inserted_at_topic_idx;


--
-- Name: messages_2026_03_06_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_06_pkey;


--
-- Name: messages_2026_03_07_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_07_inserted_at_topic_idx;


--
-- Name: messages_2026_03_07_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_07_pkey;


--
-- Name: messages_2026_03_08_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_08_inserted_at_topic_idx;


--
-- Name: messages_2026_03_08_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_08_pkey;


--
-- Name: messages_2026_03_09_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_09_inserted_at_topic_idx;


--
-- Name: messages_2026_03_09_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_09_pkey;


--
-- Name: messages_2026_03_10_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_10_inserted_at_topic_idx;


--
-- Name: messages_2026_03_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_10_pkey;


--
-- Name: messages_2026_03_11_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_11_inserted_at_topic_idx;


--
-- Name: messages_2026_03_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_11_pkey;


--
-- Name: messages_2026_03_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_12_inserted_at_topic_idx;


--
-- Name: messages_2026_03_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_12_pkey;


--
-- Name: clienti clienti_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER clienti_updated_at BEFORE UPDATE ON public.clienti FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: inventory inventory_auto_threshold; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER inventory_auto_threshold AFTER INSERT ON public.inventory FOR EACH ROW WHEN (((new.brand IS NOT NULL) AND (new.model IS NOT NULL))) EXECUTE FUNCTION public.auto_create_stock_threshold();


--
-- Name: stock_thresholds stock_thresholds_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER stock_thresholds_updated_at BEFORE UPDATE ON public.stock_thresholds FOR EACH ROW EXECUTE FUNCTION public.update_stock_threshold_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: pv_interventi pv_interventi_piano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_interventi
    ADD CONSTRAINT pv_interventi_piano_id_fkey FOREIGN KEY (piano_id) REFERENCES public.pv_piani(id) ON DELETE CASCADE;


--
-- Name: pv_intervento_prodotti pv_intervento_prodotti_intervento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_intervento_prodotti
    ADD CONSTRAINT pv_intervento_prodotti_intervento_id_fkey FOREIGN KEY (intervento_id) REFERENCES public.pv_interventi(id) ON DELETE CASCADE;


--
-- Name: pv_intervento_prodotti pv_intervento_prodotti_prodotto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_intervento_prodotti
    ADD CONSTRAINT pv_intervento_prodotti_prodotto_id_fkey FOREIGN KEY (prodotto_id) REFERENCES public.pv_prodotti(id);


--
-- Name: pv_kit_prodotti pv_kit_prodotti_kit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_kit_prodotti
    ADD CONSTRAINT pv_kit_prodotti_kit_id_fkey FOREIGN KEY (kit_id) REFERENCES public.pv_kit(id) ON DELETE CASCADE;


--
-- Name: pv_kit_prodotti pv_kit_prodotti_prodotto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_kit_prodotti
    ADD CONSTRAINT pv_kit_prodotti_prodotto_id_fkey FOREIGN KEY (prodotto_id) REFERENCES public.pv_prodotti(id);


--
-- Name: pv_liquidi_prodotti pv_liquidi_prodotti_liquido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_liquidi_prodotti
    ADD CONSTRAINT pv_liquidi_prodotti_liquido_id_fkey FOREIGN KEY (liquido_id) REFERENCES public.pv_liquidi_programmati(id) ON DELETE CASCADE;


--
-- Name: pv_liquidi_prodotti pv_liquidi_prodotti_prodotto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_liquidi_prodotti
    ADD CONSTRAINT pv_liquidi_prodotti_prodotto_id_fkey FOREIGN KEY (prodotto_id) REFERENCES public.pv_prodotti(id);


--
-- Name: pv_liquidi_programmati pv_liquidi_programmati_piano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_liquidi_programmati
    ADD CONSTRAINT pv_liquidi_programmati_piano_id_fkey FOREIGN KEY (piano_id) REFERENCES public.pv_piani(id) ON DELETE CASCADE;


--
-- Name: pv_preventivi pv_preventivi_piano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivi
    ADD CONSTRAINT pv_preventivi_piano_id_fkey FOREIGN KEY (piano_id) REFERENCES public.pv_piani(id);


--
-- Name: pv_preventivo_righe pv_preventivo_righe_preventivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivo_righe
    ADD CONSTRAINT pv_preventivo_righe_preventivo_id_fkey FOREIGN KEY (preventivo_id) REFERENCES public.pv_preventivi(id) ON DELETE CASCADE;


--
-- Name: pv_preventivo_righe pv_preventivo_righe_prodotto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pv_preventivo_righe
    ADD CONSTRAINT pv_preventivo_righe_prodotto_id_fkey FOREIGN KEY (prodotto_id) REFERENCES public.pv_prodotti(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: pv_liquidi_programmati Accesso autenticati liquidi; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Accesso autenticati liquidi" ON public.pv_liquidi_programmati TO authenticated USING (true) WITH CHECK (true);


--
-- Name: pv_liquidi_prodotti Accesso autenticati liquidi prodotti; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Accesso autenticati liquidi prodotti" ON public.pv_liquidi_prodotti TO authenticated USING (true) WITH CHECK (true);


--
-- Name: listini Accesso completo listini; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Accesso completo listini" ON public.listini USING (true) WITH CHECK (true);


--
-- Name: listini_log Allow all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all" ON public.listini_log USING (true) WITH CHECK (true);


--
-- Name: operatori Allow all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all" ON public.operatori USING (true) WITH CHECK (true);


--
-- Name: app_config Allow all on app_config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on app_config" ON public.app_config USING (true) WITH CHECK (true);


--
-- Name: stock_thresholds Allow all on stock_thresholds; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on stock_thresholds" ON public.stock_thresholds USING (true) WITH CHECK (true);


--
-- Name: clienti Allow all operations on clienti; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on clienti" ON public.clienti USING (true) WITH CHECK (true);


--
-- Name: commissioni Allow all operations on commissioni; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on commissioni" ON public.commissioni USING (true) WITH CHECK (true);


--
-- Name: pricing_policies Enable all access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all access" ON public.pricing_policies USING (true);


--
-- Name: inventory Enable all access for now; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all access for now" ON public.inventory USING (true);


--
-- Name: app_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

--
-- Name: clienti; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clienti ENABLE ROW LEVEL SECURITY;

--
-- Name: commissioni; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.commissioni ENABLE ROW LEVEL SECURITY;

--
-- Name: inventory; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

--
-- Name: listini; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.listini ENABLE ROW LEVEL SECURITY;

--
-- Name: listini_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.listini_log ENABLE ROW LEVEL SECURITY;

--
-- Name: operatori; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.operatori ENABLE ROW LEVEL SECURITY;

--
-- Name: pricing_policies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pricing_policies ENABLE ROW LEVEL SECURITY;

--
-- Name: pv_liquidi_prodotti; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pv_liquidi_prodotti ENABLE ROW LEVEL SECURITY;

--
-- Name: pv_liquidi_programmati; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pv_liquidi_programmati ENABLE ROW LEVEL SECURITY;

--
-- Name: stock_thresholds; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stock_thresholds ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime commissioni; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.commissioni;


--
-- Name: supabase_realtime inventory; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.inventory;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict 9mle8sIZZAOFvkav5l0k3E2qq0a2pJdR99HyBy2m0MzWfRnK7gtBb5qyT4Bg27B

