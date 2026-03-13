--
-- PostgreSQL database dump
--

\restrict VapJtfoq4efyegwR6NyejYBVaLZzbhQKJaUpyBkn9Hsj7AFEUsOS2nwHN50bNlp

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
DROP POLICY IF EXISTS allow_all_noleggio_macchine ON public.noleggio_macchine;
DROP POLICY IF EXISTS allow_all_noleggio_listini ON public.noleggio_listini;
DROP POLICY IF EXISTS allow_all_noleggio_abbonamenti ON public.noleggio_abbonamenti;
DROP POLICY IF EXISTS "Enable all access for now" ON public.inventory;
DROP POLICY IF EXISTS "Enable all access" ON public.pricing_policies;
DROP POLICY IF EXISTS "Allow all operations on commissioni" ON public.commissioni;
DROP POLICY IF EXISTS "Allow all operations on clienti" ON public.clienti;
DROP POLICY IF EXISTS "Allow all on stock_thresholds" ON public.stock_thresholds;
DROP POLICY IF EXISTS "Allow all on app_config" ON public.app_config;
DROP POLICY IF EXISTS "Allow all" ON public.pratovivo_archivio;
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
ALTER TABLE IF EXISTS ONLY public.noleggio_listini DROP CONSTRAINT IF EXISTS noleggio_listini_macchina_id_fkey;
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
DROP INDEX IF EXISTS public.pratovivo_archivio_created_at_idx;
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
DROP INDEX IF EXISTS auth.custom_oauth_providers_provider_type_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_identifier_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_enabled_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_created_at_idx;
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
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_15 DROP CONSTRAINT IF EXISTS messages_2026_03_15_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_14 DROP CONSTRAINT IF EXISTS messages_2026_03_14_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_13 DROP CONSTRAINT IF EXISTS messages_2026_03_13_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_12 DROP CONSTRAINT IF EXISTS messages_2026_03_12_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_11 DROP CONSTRAINT IF EXISTS messages_2026_03_11_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_10 DROP CONSTRAINT IF EXISTS messages_2026_03_10_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_03_09 DROP CONSTRAINT IF EXISTS messages_2026_03_09_pkey;
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
ALTER TABLE IF EXISTS ONLY public.pratovivo_archivio DROP CONSTRAINT IF EXISTS pratovivo_archivio_pkey;
ALTER TABLE IF EXISTS ONLY public.operatori DROP CONSTRAINT IF EXISTS operatori_pkey;
ALTER TABLE IF EXISTS ONLY public.operatori DROP CONSTRAINT IF EXISTS operatori_nome_key;
ALTER TABLE IF EXISTS ONLY public.noleggio_macchine DROP CONSTRAINT IF EXISTS noleggio_macchine_pkey;
ALTER TABLE IF EXISTS ONLY public.noleggio_listini DROP CONSTRAINT IF EXISTS noleggio_listini_pkey;
ALTER TABLE IF EXISTS ONLY public.noleggio_listini DROP CONSTRAINT IF EXISTS noleggio_listini_macchina_id_fascia_tipo_listino_key;
ALTER TABLE IF EXISTS ONLY public.noleggio_abbonamenti DROP CONSTRAINT IF EXISTS noleggio_abbonamenti_pkey;
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
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_identifier_key;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS public.noleggio_macchine ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.noleggio_listini ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.noleggio_abbonamenti ALTER COLUMN id DROP DEFAULT;
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
DROP TABLE IF EXISTS realtime.messages_2026_03_15;
DROP TABLE IF EXISTS realtime.messages_2026_03_14;
DROP TABLE IF EXISTS realtime.messages_2026_03_13;
DROP TABLE IF EXISTS realtime.messages_2026_03_12;
DROP TABLE IF EXISTS realtime.messages_2026_03_11;
DROP TABLE IF EXISTS realtime.messages_2026_03_10;
DROP TABLE IF EXISTS realtime.messages_2026_03_09;
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
DROP TABLE IF EXISTS public.pratovivo_archivio;
DROP TABLE IF EXISTS public.operatori;
DROP SEQUENCE IF EXISTS public.noleggio_macchine_id_seq;
DROP TABLE IF EXISTS public.noleggio_macchine;
DROP SEQUENCE IF EXISTS public.noleggio_listini_id_seq;
DROP TABLE IF EXISTS public.noleggio_listini;
DROP SEQUENCE IF EXISTS public.noleggio_abbonamenti_id_seq;
DROP TABLE IF EXISTS public.noleggio_abbonamenti;
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
DROP TABLE IF EXISTS auth.custom_oauth_providers;
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
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


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
-- Name: noleggio_abbonamenti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.noleggio_abbonamenti (
    id integer NOT NULL,
    cliente_nome text NOT NULL,
    cliente_tel text,
    tipo text NOT NULL,
    credito_residuo numeric(10,2) DEFAULT 0,
    data_inizio date,
    data_scadenza date,
    note text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT noleggio_abbonamenti_tipo_check CHECK ((tipo = ANY (ARRAY['b'::text, 'c'::text])))
);


--
-- Name: noleggio_abbonamenti_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.noleggio_abbonamenti_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: noleggio_abbonamenti_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.noleggio_abbonamenti_id_seq OWNED BY public.noleggio_abbonamenti.id;


--
-- Name: noleggio_listini; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.noleggio_listini (
    id integer NOT NULL,
    macchina_id integer,
    fascia text,
    tipo_listino text DEFAULT 'std'::text,
    prezzo_iva numeric(10,2),
    prezzo_netto numeric(10,2),
    CONSTRAINT noleggio_listini_fascia_check CHECK ((fascia = ANY (ARRAY['mezzo_giorno'::text, 'uno_giorno'::text, 'due_tre_giorni'::text, 'quattro_sette_giorni'::text, 'oltre_sette_giorni'::text]))),
    CONSTRAINT noleggio_listini_tipo_listino_check CHECK ((tipo_listino = ANY (ARRAY['std'::text, 'b'::text, 'c'::text])))
);


--
-- Name: noleggio_listini_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.noleggio_listini_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: noleggio_listini_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.noleggio_listini_id_seq OWNED BY public.noleggio_listini.id;


--
-- Name: noleggio_macchine; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.noleggio_macchine (
    id integer NOT NULL,
    nome text NOT NULL,
    note_tecniche text,
    categoria text,
    carburante text,
    deposito_cauzionale numeric(10,2),
    attiva boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    famiglia text,
    is_accessorio boolean DEFAULT false,
    CONSTRAINT noleggio_macchine_categoria_check CHECK ((categoria = ANY (ARRAY['tappeto_erboso'::text, 'attrezzi'::text, 'tagliaerba'::text, 'escavatori'::text, 'altro'::text])))
);


--
-- Name: noleggio_macchine_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.noleggio_macchine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: noleggio_macchine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.noleggio_macchine_id_seq OWNED BY public.noleggio_macchine.id;


--
-- Name: operatori; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operatori (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    creato_il timestamp with time zone DEFAULT now()
);


--
-- Name: pratovivo_archivio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pratovivo_archivio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    nome_cliente text,
    mq numeric,
    tipo_intervento text,
    tipo_prato text,
    livello text,
    linea text,
    terreno text,
    colore text,
    irrigazione text,
    tipo_cliente text,
    degradazione text,
    estendi12 boolean DEFAULT false,
    liquidi_sab boolean DEFAULT false,
    miscuglio_id text,
    miscuglio_nome text,
    totale_preventivo numeric,
    pdf_params jsonb,
    note text
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
-- Name: messages_2026_03_13; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_13 (
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
-- Name: messages_2026_03_14; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_14 (
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
-- Name: messages_2026_03_15; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_03_15 (
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
-- Name: messages_2026_03_13; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_13 FOR VALUES FROM ('2026-03-13 00:00:00') TO ('2026-03-14 00:00:00');


--
-- Name: messages_2026_03_14; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_14 FOR VALUES FROM ('2026-03-14 00:00:00') TO ('2026-03-15 00:00:00');


--
-- Name: messages_2026_03_15; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_15 FOR VALUES FROM ('2026-03-15 00:00:00') TO ('2026-03-16 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: noleggio_abbonamenti id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_abbonamenti ALTER COLUMN id SET DEFAULT nextval('public.noleggio_abbonamenti_id_seq'::regclass);


--
-- Name: noleggio_listini id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_listini ALTER COLUMN id SET DEFAULT nextval('public.noleggio_listini_id_seq'::regclass);


--
-- Name: noleggio_macchine id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_macchine ALTER COLUMN id SET DEFAULT nextval('public.noleggio_macchine_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
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
20260219120000
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
9782a688-1195-441c-92fa-8c588bff588a	2026-03-11 09:23:07.636654+00	2026-03-11 09:23:07.636654+00	Claudio	Apvan	Apvan Claudio	Via Rovigo 10	30024	Musile Di Piave	VE	3246197179	\N	\N	\N	\N	Apvan Claudio	manuale	\N	\N
3f80ed4d-467a-445b-bec1-68899a8248bb	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Buffon Giancarlo			VIA MARONCELLI 6	31038	PAESE	TV	3496148085			\N	\N	buffon giancarlo paese 	migrazione	\N	\N
3d0adf61-de7a-4a05-a014-e84f0303f9d7	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Cadorin Roberto			VIA PARIS BORDONE, 39 - BIANCADE	31056	RONCADE	TV	3479715095			\N	\N	cadorin roberto roncade 	migrazione	\N	\N
a168c56d-e577-4eb2-b83c-1a4a61df1cd5	2026-03-01 18:24:01.415968+00	2026-03-01 18:24:01.415968+00	Camarotto Michele			VIA PASSO LAMPOL, 27/A	30020	FOSSALTA DI PIAVE	VE	3484460983	saradilegui@libero.it		\N	\N	camarotto michele fossalta di piave 	migrazione	\N	\N
ab516c2b-278b-493d-9a04-574dbaefb17b	2026-03-11 16:13:22.44597+00	2026-03-11 16:13:22.44597+00	Sergio	Zanetti	Zanetti Sergio	Via Fornace 24	\N	Marcon	VE	3477341198	magali.ditadi@virgilio.it	\N	\N	\N	Zanetti Sergio	manuale	\N	\N
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
6bf65e71-0cb6-4772-a26c-085a7619a0ff	2026-03-11 09:25:28.664558+00	2026-03-11 09:25:28.664558+00	Claudio	Pavan	Pavan Claudio	Via Rovigo 10	\N	Musile Di Piave	VE	3246197179	\N	\N	\N	\N	Pavan Claudio	manuale	\N	\N
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
1773154024602	2026-03-10 14:47:04.601+00	Cenedese Paolo	{"id": "501568", "cap": "31057", "nome": "Cenedese Paolo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "3393170646", "indirizzo": "VIA CRETA, 2", "provincia": "TV", "searchText": "cenedese paolo silea ", "telefonoOriginale": "3393170646"}	3393170646	Simone	[]	[{"id": 1773154012039, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-10 14:47:04.601+00	f	user_1773139186105	vendita	f	f	f
1773245655924	2026-03-11 16:14:15.315+00	Zanetti Sergio	{"cf": null, "id": "ab516c2b-278b-493d-9a04-574dbaefb17b", "cap": null, "sdi": null, "nome": "Zanetti Sergio", "piva": null, "email": "magali.ditadi@virgilio.it", "nomeP": "Zanetti Sergio", "localita": "Marcon", "telefono": "3477341198", "indirizzo": "Via Fornace 24", "provincia": "VE", "searchText": "Zanetti Sergio"}	3477341198	Simone	[{"brand": "Stihl", "model": "Decespugliatore FS 55 R", "prezzo": 239, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "838434202"}]	[]	239	\N	\N	\N	scontrino	completed	2026-03-11 16:14:15.315+00	t	user_1769961017929	vendita	f	f	f
1771333556925	2026-02-17 11:00:00+00	Eos Cooperativa Sociale	{"id": "508412", "cap": "31033", "nome": "Eos Cooperativa Sociale", "email": "info@eoscooperativa.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "CASTELFRANCO VENETO", "telefono": "3402249187", "indirizzo": "VIA OSPEDALE, 10", "provincia": "TV", "searchText": "eos cooperativa sociale castelfranco veneto ", "telefonoOriginale": "3402249187"}	3402249187	Simone	[]	[{"id": 1771333442068, "nome": "Stihl bobina filo tondo 2,7 MT 208 art. 0000 930 2227", "prezzo": 29.28, "quantita": 51, "matricola": null, "aliquotaIva": 22}]	0	\N	\N	Consegnare e ritirare 36 bobine filo 2,7 347 MT art. 0000 930 2289 per cambio articolo	fattura	completed	2026-02-17 11:00:00+00	t	user_1769961017929	cambio	f	f	f
1772470754631	2026-03-02 16:59:14.321+00	Edil Demi Di Covassin Demido	{"id": "502529", "cap": "31048", "nome": "Edil Demi Di Covassin Demido", "email": "edil-demi@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3482652180", "indirizzo": "VIA POSTUMIA CENTRO , 16/A", "provincia": "TV", "searchText": "edil demi di covassin demido san biagio di callalta ", "telefonoOriginale": "3482652180"}	3482652180	Simone	[{"brand": "STIHL", "model": "Troncatrice TS 910.0i, 400mm/16\\"", "prezzo": 1980, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "196978666"}]	[{"id": 1772470732908, "nome": "Motomix 5 litri", "prezzo": 27, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	2007	\N	\N	\N	fattura	completed	2026-03-02 16:59:14.321+00	t	user_1769961017929	vendita	f	f	f
1772698454042	2026-03-05 08:14:14.042+00	Visentin Roberto	{"id": "509469", "cap": "31030", "nome": "Visentin Roberto", "email": "spazzioverde1@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "BREDA DI PIAVE", "telefono": "3467443956", "indirizzo": "VIA ANGELA VERONESE, 22", "provincia": "TV", "searchText": "visentin roberto breda di piave ", "telefonoOriginale": "3467443956"}	3467443956	Simone	[]	[{"id": 1772698447121, "nome": "Strong 10 kg", "prezzo": 81.5, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	81.5	\N	\N	\N	scontrino	completed	2026-03-05 08:14:14.042+00	t	user_1770584612559	vendita	f	f	f
1772810660020	2026-03-06 15:24:20.02+00	Gemma Verde Loriano De Biasi	{"id": "509792", "cap": "31038", "nome": "Gemma Verde Loriano De Biasi", "email": "de.biasi.loriano@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3402878608", "indirizzo": "VIA P. MALVESTITI 10 - POSTIOMA", "provincia": "TV", "searchText": "gemma verde loriano de biasi paese ", "telefonoOriginale": "3402878608"}	3402878608	Simone	[]	[{"id": 1772810629122, "nome": "Green 7 25 kg", "prezzo": 43, "quantita": 2, "matricola": null, "aliquotaIva": 4}]	86	\N	\N	\N	scontrino	completed	2026-03-06 15:24:20.02+00	f	user_1772789533838	vendita	f	f	f
1773050032197	2026-03-09 11:00:00+00	Battistel Denis	{"cf": null, "id": "aab0f8c6-cd23-40a0-bb56-3d2137d0591a", "cap": "31048", "sdi": null, "nome": "Battistel Denis", "piva": null, "email": "battisteldenis@gmail.com", "nomeP": "Battistel Denis", "localita": "San Biagio di Callalta", "telefono": "3280864412", "indirizzo": "Via Francescata 6", "provincia": "TV", "searchText": "Battistel Denis"}	3280864412	Simone	[]	[{"id": 1773050023366, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 2, "matricola": null, "aliquotaIva": 4}, {"id": 1773050391718, "nome": "HURRICANE KG 5", "prezzo": 54.45, "quantita": 1}]	149.85	\N	\N	\N	scontrino	completed	2026-03-09 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1773331552845	2026-03-12 16:05:52.845+00	Gemma Verde Loriano De Biasi	{"id": "509792", "cap": "31038", "nome": "Gemma Verde Loriano De Biasi", "email": "de.biasi.loriano@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3402878608", "indirizzo": "VIA P. MALVESTITI 10 - POSTIOMA", "provincia": "TV", "searchText": "gemma verde loriano de biasi paese ", "telefonoOriginale": "3402878608"}	3402878608	Simone	[]	[{"id": 1773331548714, "nome": "Green 7 25 kg", "prezzo": 43, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	43	\N	\N	\N	scontrino	completed	2026-03-12 16:05:52.845+00	t	user_1773313248876	vendita	f	f	f
1772193413182	2026-02-27 11:56:52.399+00	Habitat Natura Di Simone Taffarello	{"id": "201214", "cap": "31048", "nome": "Habitat Natura Di Simone Taffarello", "email": "info@habitatnatura.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "335312402", "indirizzo": "VIA SAN FLORIANO, 11/A - OLMI", "provincia": "TV", "searchText": "habitat natura di simone taffarello san biagio di callalta ", "telefonoOriginale": "335312402"}	335312402	Simone	[{"brand": "Volpi", "model": "Decespugliatore Ciao", "prezzo": 36, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PP4624.359NB"}]	[]	36	\N	\N	\N	scontrino	completed	2026-02-27 11:56:52.399+00	f	user_1769961017929	vendita	f	f	f
1772471899116	2026-03-02 17:18:18.951+00	Viviani Antonio	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega CS-280TES", "prezzo": 299, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "C75138079230"}]	[{"id": 1772471856132, "nome": "Marline 2 T 5 litri", "prezzo": 27, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1772471886378, "nome": "Olio catena Pro Up 2 litri", "prezzo": 11, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	337	\N	\N	\N	scontrino	completed	2026-03-02 17:18:18.951+00	t	user_1769961017929	vendita	f	f	f
1772814552841	2026-03-06 16:29:12.841+00	Lombardi Pietro	\N	\N	Simone	[{"brand": "Stocker", "model": "Irroratore Geyser Pro", "prezzo": 1590, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "2541572916785"}]	[{"id": 1772814456411, "nome": "Alimentatore", "prezzo": 124, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	1714	\N	\N	\N	fattura	completed	2026-03-06 16:29:53.647+00	t	user_1770584612559	vendita	f	f	f
1773052842702	2026-03-09 10:40:42.702+00	Gemma Verde Loriano De Biasi	{"id": "509792", "cap": "31038", "nome": "Gemma Verde Loriano De Biasi", "email": "de.biasi.loriano@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3402878608", "indirizzo": "VIA P. MALVESTITI 10 - POSTIOMA", "provincia": "TV", "searchText": "gemma verde loriano de biasi paese ", "telefonoOriginale": "3402878608"}	3402878608	Simone	[]	[{"id": 1773052836762, "nome": "Green 7 25 kg", "prezzo": 43, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	43	\N	\N	\N	scontrino	completed	2026-03-09 10:40:42.702+00	t	user_1773043211070	vendita	f	f	f
1773159163790	2026-03-10 16:12:43.197+00	Il Filo D'ERBA Di De Bernardo Sebastiano	{"id": "202718", "cap": "30020", "nome": "Il Filo D'ERBA Di De Bernardo Sebastiano", "email": "sebastiano.ilfiloderba@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "MARCON", "telefono": "3395274358", "indirizzo": "VIA MONTE PELMO, 8", "provincia": "VE", "searchText": "il filo d'erba di de bernardo sebastiano marcon ", "telefonoOriginale": "3395274358"}	3395274358	Simone	[{"brand": "Honda", "model": "Rasaerba HRN536C2 VYEH", "prezzo": 959, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MCSF1069705"}]	[]	959	\N	\N	\N	fattura	completed	2026-03-10 16:12:43.197+00	t	user_1769961017929	vendita	f	f	f
1773248038153	2026-03-11 16:53:58.152+00	CARDIN SIMONE	\N	\N	Simone	[]	[{"id": 1773247391717, "nome": "NEBUZAN REPELLENTE LT. 5", "prezzo": 140, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1773247441666, "nome": "PIREKRAFT INSETTICIDA CON CONCENTRATO", "prezzo": 42, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	182	\N	\N	\N	scontrino	completed	2026-03-11 16:53:58.152+00	f	user_1773240946720	vendita	f	f	f
1772699565277	2026-03-05 08:32:45.274+00	Fantuzzo Luca	\N	\N	Simone	[{"brand": "Honda", "model": "Trattorino HF2625 HME", "prezzo": 6199, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MBWF-1600622"}]	[]	6199	3000	pos	Consegna a domicilio appena pronto. Saldo con bonifico bancario	scontrino	completed	2026-03-12 13:28:13.02+00	t	user_1769961017929	vendita	f	f	f
1773336328776	2026-03-12 17:25:28.775+00	Gemma Giardini Di Andrea Geminian	{"id": "508586", "cap": "31030", "nome": "Gemma Giardini Di Andrea Geminian", "email": "andrea.geminian@yahoo.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3403901383", "indirizzo": "VIA 4 NOVEMBRE, 46", "provincia": "TV", "searchText": "gemma giardini di andrea geminian carbonera ", "telefonoOriginale": "3403901383"}	3403901383	Simone	[]	[{"id": 1773336279404, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	104	\N	\N	\N	scontrino	completed	2026-03-12 17:25:28.775+00	t	user_1773313248876	vendita	f	f	f
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
1773217623696	2026-03-11 08:27:03.352+00	Boccardelli Alessandro	{"id": "501331", "cap": "31030", "nome": "Boccardelli Alessandro", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "BREDA DI PIAVE", "telefono": "3477767769", "indirizzo": "VIA PER CAVRIE, 16 - SAN BARTOLOMEO", "provincia": "TV", "searchText": "boccardelli alessandro breda di piave ", "telefonoOriginale": "3477767769"}	3477767769	Simone	[{"brand": "Honda", "model": "Rasaerba HRX476C2 HYEH", "prezzo": 1250, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MBYF1064510"}]	[]	1250	\N	\N	\N	scontrino	completed	2026-03-11 08:27:03.352+00	t	user_1769961017929	vendita	f	f	f
recovered-129	2026-01-26 11:00:00+00	PAOLO BARBON	\N	\N	Simone	[]	[{"nome": "WEIBANG TRINCIAERBA CARDANO 3 VELOCITA WBBC537SCV", "prezzo": 1350, "quantita": 1, "aliquotaIva": 22}]	1350	100	contanti	cell. 3464744611	scontrino	completed	2026-01-26 11:00:00+00	t	Simone	vendita	f	f	f
1772785776569	2026-03-06 08:29:36.569+00	Taffarello Giuliano	{"id": "504173", "cap": "31030", "nome": "Taffarello Giuliano", "email": "giuliano.taffarello@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3356947922", "indirizzo": "VIA GRANDE DI MIGNAGOLA, 73", "provincia": "TV", "searchText": "taffarello giuliano carbonera ", "telefonoOriginale": "3356947922"}	3356947922	Simone	[{"brand": "Segway", "model": "Robot tosaerba X430E", "prezzo": 3500, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[]	3500	500	pos	\N	scontrino	pending	\N	t	user_1770584612559	vendita	f	f	f
1772872572362	2026-03-07 08:36:11.624+00	Favaro Arnaldo	{"id": "512983", "cap": "31056", "nome": "Favaro Arnaldo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3391572851", "indirizzo": "VIA GALLI, 39/B", "provincia": "TV", "searchText": "favaro arnaldo roncade ", "telefonoOriginale": "3391572851"}	3391572851	Admin	[{"brand": "STIHL", "model": " MSA 70.0 C", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452200572"}, {"brand": "STIHL", "model": " AK 20", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "45204006535AE021G02910599504"}, {"brand": "STIHL", "model": " AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702287103"}]	[]	398	\N	\N	\N	scontrino	completed	2026-03-07 08:36:11.624+00	t	user_1772723709793	vendita	f	f	f
1773068231847	2026-03-09 11:00:00+00	vivai lovisetto marco	\N	\N	Simone	[]	[{"id": 1773068091299, "nome": "MOLLA A TAZZA 40 X20,4X0,5", "prezzo": 1.56, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091300, "nome": "PERNO LAMA FD", "prezzo": 7.95, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091301, "nome": "LAMA PIATTO CLS9/CLS10/TRINCIA", "prezzo": 16.8, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091302, "nome": "RONDELLA 35 X 12,5 X 6", "prezzo": 2.05, "quantita": 2, "matricola": null, "aliquotaIva": 22}, {"id": 1773068091303, "nome": "DADO 12X1,75 AUTUBL BASSO", "prezzo": 0.33, "quantita": 2, "matricola": null, "aliquotaIva": 22}]	57.38	\N	\N	\N	fattura	completed	2026-03-09 11:00:00+00	f	user_1769961017929	vendita	f	f	f
1773338235441	2026-03-12 17:57:15.441+00	CENEDESE FABRIZIO	\N	\N	Simone	[]	[{"id": 1773338206431, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-12 17:57:15.441+00	t	user_1773313248876	vendita	f	f	f
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
1773221325833	2026-03-11 09:28:45.472+00	Pavan Claudio	{"cf": null, "id": "6bf65e71-0cb6-4772-a26c-085a7619a0ff", "cap": null, "sdi": null, "nome": "Pavan Claudio", "piva": null, "email": null, "nomeP": "Pavan Claudio", "localita": "Musile Di Piave", "telefono": "3246197179", "indirizzo": "Via Rovigo 10", "provincia": "VE", "searchText": "Pavan Claudio"}	3246197179	Simone	[{"brand": "Grillo", "model": " Trimmer HWT600", "prezzo": 1250, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "695024"}]	[]	1250	300	contanti	\N	scontrino	completed	2026-03-11 09:28:45.472+00	t	user_1769961017929	vendita	f	f	f
1773330444130	2026-02-16 11:00:00+00	Nico Giardini Di Bastarolo Nicola	{"cf": "", "id": "a30d71c6-49e4-4587-adc2-d9cb771e0186", "cap": "31059", "sdi": "", "nome": "Nico Giardini Di Bastarolo Nicola", "piva": "", "email": "nickbast74@gmail.com", "nomeP": "Nico Giardini Di Bastarolo Nicola", "_fonte": "db", "cognome": "", "contatto": "", "localita": "ZERO BRANCO", "telefono": "3498200169", "indirizzo": "VIA G.B. GUIDINI, 29", "provincia": "TV", "searchText": "nico giardini di bastarolo nicola zero branco "}	3498200169	Simone	[]	[{"id": 1773330333121, "nome": "Green 7 25 kg", "prezzo": 38.7, "quantita": 30, "matricola": null, "aliquotaIva": 4}, {"id": 1773330347033, "nome": "Albatros Green 8 Kg 25 25 kg", "prezzo": 49.3, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	1210.3	\N	\N	\N	fattura	completed	2026-02-16 11:00:00+00	t	user_1770584612559	vendita	f	f	f
1770385464630	2026-02-06 13:44:24.631+00	AZ. AGR. Moz Moreno	{"id": "510801", "cap": "30100", "nome": "AZ. AGR. Moz Moreno", "email": "fattoriaimpronta@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "VENEZIA", "telefono": "3408032699", "indirizzo": "VIA PASSO CAMPALTO, 15A - CAMPALTO", "provincia": "VE", "searchText": "az. agr. moz moreno venezia ", "telefonoOriginale": "3408032699"}	3408032699	Simone	[]	[{"id": 1770385435974, "nome": "Zaino supporto tosasiepi", "prezzo": 400, "quantita": 1, "descrizione": "ZAINO SUPPORTO TOSASIEPI"}]	400	\N	\N	I.C.	fattura	completed	2026-02-06 13:44:24.631+00	t	user_1769961017929	vendita	f	f	f
1772274248500	2026-02-28 10:24:07.909+00	Buscato Mattia via Ca' Memo 29 Noventa di Piave 340 4519357 mbuschy04@gmail.com	\N	\N	Simone	[{"brand": "Honda", "model": "Tosaerba HRN536C2 VYEH", "prezzo": 959, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "MCSF1028729"}]	[]	959	\N	\N	\N	scontrino	completed	2026-02-28 10:24:07.909+00	t	user_1769961017929	vendita	f	f	f
1770626009165	2026-02-09 08:33:29.165+00	Moretti Marco	{"id": "202904", "cap": "31100", "nome": "Moretti Marco", "email": "moretti72.marco@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3392050119", "indirizzo": "VIA TIMAVO", "provincia": "TV", "searchText": "moretti marco treviso ", "telefonoOriginale": "3392050119"}	3392050119	Simone	[{"brand": "", "model": "MOTOSEGA MSA 161 T", "prezzo": 425, "isOmaggio": false, "serialNumber": "451890971"}]	[]	425	\N	\N	\N	fattura	completed	2026-02-09 08:33:29.165+00	t	user_1769961017929	vendita	f	f	f
1770744173693	2026-02-10 17:22:53.693+00	Camarotto Michele	{"id": "502091", "cap": "30020", "nome": "Camarotto Michele", "email": "saradilegui@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "FOSSALTA DI PIAVE", "telefono": "3484460983", "indirizzo": "VIA PASSO LAMPOL, 27/A", "provincia": "VE", "searchText": "camarotto michele fossalta di piave ", "telefonoOriginale": "3484460983"}	3484460983	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV295", "prezzo": 199, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "ZA1625.124NB"}]	[]	199	\N	\N	\N	scontrino	completed	2026-02-10 17:22:53.693+00	t	user_1769961017929	vendita	f	f	f
1770801828120	2026-02-11 09:23:48.12+00	Nico Giardini Di Bastarolo Nicola	{"id": "504139", "cap": "31059", "nome": "Nico Giardini Di Bastarolo Nicola", "email": "nickbast74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "ZERO BRANCO", "telefono": "3498200169", "indirizzo": "VIA G.B. GUIDINI, 29", "provincia": "TV", "searchText": "nico giardini di bastarolo nicola zero branco ", "telefonoOriginale": "3498200169"}	3498200169	Simone	[]	[{"id": 1770801600789, "nome": "Manicotti antitaglio ", "prezzo": 48, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801636352, "nome": "Ricambio Archman svettatoio ", "prezzo": 16, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801660760, "nome": "Visiera completa", "prezzo": 10, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801714594, "nome": "Cosciale copri pantaloni ", "prezzo": 17, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801775018, "nome": "Filo dice 3 mm 50 metri quadro R304342", "prezzo": 13.9, "quantita": 3, "matricola": null, "aliquotaIva": 22}, {"id": 1770801796561, "nome": "Svettatoio Archman ", "prezzo": 120, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	252.7	\N	\N	\N	fattura	completed	2026-02-11 09:23:48.12+00	t	user_1769961017929	vendita	f	f	f
1770997818464	2026-02-13 15:50:18.464+00	Scomparin Pierino	{"id": "502251", "cap": "31057", "nome": "Scomparin Pierino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "3394191177", "indirizzo": "VIA BELVEDERE, 71", "provincia": "TV", "searchText": "scomparin pierino silea ", "telefonoOriginale": "3394191177"}	3394191177	Simone	[{"brand": "STIHL", "model": "Batteria AS2 (28 Wh)", "prezzo": 42, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "950420572"}]	[]	42	\N	\N	\N	scontrino	completed	2026-02-13 15:50:18.464+00	t	user_1769961017929	vendita	f	f	f
1772791840067	2026-03-06 10:10:40.067+00	Torresan Silvano	{"id": "504548", "cap": "31050", "nome": "Torresan Silvano", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "MONASTIER DI TREVISO", "telefono": "3280309741", "indirizzo": "VIA EMILIA, 24", "provincia": "TV", "searchText": "torresan silvano monastier di treviso ", "telefonoOriginale": "3280309741"}	3280309741	Simone	[{"brand": "Stiga", "model": "Trattorino Rider usato con cambio manuale e piatto da 72 cm", "prezzo": 1100, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "usato giallo"}]	[]	1100	\N	\N	Preparare e chiamare per consegna appena pronto	scontrino	completed	2026-03-06 10:11:09.298+00	t	user_1770584612559	vendita	f	f	f
1771231859301	2026-02-16 11:00:00+00	Bisetto Mario	{"id": "502153", "cap": "31030", "nome": "Bisetto Mario", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3493730882", "indirizzo": "VIA CODALUNGA, 135", "provincia": "TV", "searchText": "bisetto mario carbonera ", "telefonoOriginale": "3493730882"}	3493730882	Simone	[{"brand": "STIHL", "model": "Decespugliatore FSA 80 R", "prezzo": 509, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "546519977"}, {"brand": "STIHL", "model": "Caricabatterie AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702817744"}, {"brand": "STIHL", "model": "Batteria AK 30.0S", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "912736933"}]	[]	509	\N	\N	\N	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1773044516572	2026-03-09 08:21:56.571+00	Piave Service Srl	{"id": "503141", "cap": "31030", "nome": "Piave Service Srl", "email": "piave-service@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "BREDA DI PIAVE", "telefono": "3488994157", "indirizzo": "VIA SAN GIACOMO, 5", "provincia": "TV", "searchText": "piave service srl breda di piave ", "telefonoOriginale": "3488994157"}	3488994157	Simone	[]	[{"id": 1773044495289, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 1, "matricola": null, "aliquotaIva": 10}, {"id": 1773044503779, "nome": "Hurricane (Sole+Ombra) 5 kg", "prezzo": 52, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	156	\N	\N	\N	fattura	completed	2026-03-09 08:21:56.571+00	t	user_1773043211070	vendita	f	f	f
1773240850390	2026-03-11 14:54:10.39+00	Palma Paolo	\N	\N	Simone	[]	[{"id": 1773240834044, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1773240842536, "nome": "Albatros Green 8 Kg 25 25 kg", "prezzo": 60.8, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	108.5	\N	\N	\N	scontrino	completed	2026-03-11 14:54:10.39+00	t	user_1769961017929	vendita	f	f	f
1771258833161	2026-02-16 11:00:00+00	Balanza Marino	{"id": "509979", "cap": "31048", "nome": "Balanza Marino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3466323236", "indirizzo": "VIA CLAUDIA AUGUSTA, 6", "provincia": "TV", "searchText": "balanza marino san biagio di callalta ", "telefonoOriginale": "3466323236"}	3466323236	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV390", "prezzo": 459, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PZ2925.389NB"}, {"brand": "VOLPI", "model": "Potatore KVS6000", "prezzo": 200, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "SM4222498LS"}]	[{"id": 1771258823114, "nome": "Occhiali ", "prezzo": 5, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	664	\N	\N	Potatore senza batterie	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771492465151	2026-02-19 11:00:00+00	Sartori Luca	{"id": "203045", "cap": "31100", "nome": "Sartori Luca", "email": "sartoriluca74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3494968896", "indirizzo": "VIA S.ANTONINO 288", "provincia": "TV", "searchText": "sartori luca treviso ", "telefonoOriginale": "3494968896"}	3494968896	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310977"}]	[]	350	\N	\N	Pagamento BB fine mese	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771493646908	2026-02-19 11:00:00+00	Buffon Giancarlo	{"id": "512986", "cap": "31038", "nome": "Buffon Giancarlo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3496148085", "indirizzo": "VIA MARONCELLI 6", "provincia": "TV", "searchText": "buffon giancarlo paese ", "telefonoOriginale": "3496148085"}	3496148085	Simone	[{"brand": "STIHL", "model": "Tagliabordi FSA 30.0", "prezzo": 159, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "838110682"}, {"brand": "STIHL", "model": "Caricabatterie AL 1", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "935280185"}, {"brand": "STIHL", "model": "Batteria AS 2", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "937056842"}]	[{"id": 1771493623647, "nome": "Ricambio polycut", "prezzo": 4, "quantita": 2, "matricola": null, "aliquotaIva": 22}]	167	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	f	user_1769961017929	vendita	f	f	f
1771498408037	2026-02-19 11:00:00+00	AZ. AGR. Vivai Piante Di Dragancea Andrei	{"id": "202724", "cap": "31056", "nome": "AZ. AGR. Vivai Piante Di Dragancea Andrei", "email": "andrei.dragancea@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3282670287", "indirizzo": "VIA ARRIGO BOITO, 10 - BIANCADE", "provincia": "TV", "searchText": "az. agr. vivai piante di dragancea andrei roncade ", "telefonoOriginale": "3282670287"}	3282670287	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310979"}]	[]	350	\N	\N	\N	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771514517527	2026-02-19 11:00:00+00	Gasparini Francesco	{"id": "505627", "cap": "30020", "nome": "Gasparini Francesco", "email": "gasparini.francesco@virgilio.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "MEOLO", "telefono": "3939936820", "indirizzo": "VIA CA' CORNER SUD, 49", "provincia": "VE", "searchText": "gasparini francesco meolo ", "telefonoOriginale": "3939936820"}	3939936820	Simone	[{"brand": "Stihl", "model": "Atomizzatore SR 430 Mistblower", "prezzo": 760, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "370193762"}]	[]	760	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	t	user_1769961017929	vendita	f	f	f
1771667848261	2026-02-21 11:00:00+00	Cadorin Roberto	{"id": "514044", "cap": "31056", "nome": "Cadorin Roberto", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3479715095", "indirizzo": "VIA PARIS BORDONE, 39 - BIANCADE", "provincia": "TV", "searchText": "cadorin roberto roncade ", "telefonoOriginale": "3479715095"}	3479715095	Simone	[]	[{"id": 1771667799331, "nome": "CONCIME GREEN 7", "prezzo": 45.3, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	45.3	\N	\N	\N	scontrino	completed	2026-02-21 11:00:00+00	t	user_1771659500533	vendita	f	f	f
1771596591121	2026-02-20 14:09:50.604+00	Bonetto Franco	{"id": "511303", "cap": "31048", "nome": "Bonetto Franco", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3452383445", "indirizzo": "VIA ORTIGARA, 7 - FAGARE'", "provincia": "TV", "searchText": "bonetto franco san biagio di callalta ", "telefonoOriginale": "3452383445"}	3452383445	Simone	[{"brand": "VOLPI", "model": "Potatore KVS8000", "prezzo": 370, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "SL3325.372NB"}]	[]	370	\N	\N	\N	scontrino	completed	2026-02-20 14:09:50.604+00	t	user_1769961017929	vendita	f	f	f
1771670427449	2026-02-21 10:40:26.358+00	Chiericati Massimo	{"id": "505901", "cap": "31100", "nome": "Chiericati Massimo", "email": "", "nomeP": "", "cognome": "", "contatto": "Fronte Hotel Carletto", "localita": "TREVISO", "telefono": "3407860739", "indirizzo": "VIA SEBASTIANO CABOTO, 13 - SELVANA", "provincia": "TV", "searchText": "chiericati massimo treviso fronte hotel carletto", "telefonoOriginale": "3407860739"}	3407860739	Simone	[{"brand": "STIHL", "model": "Motosega MS 194 T 1/4 P Chainsaw", "prezzo": 349, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "540455888"}]	[{"id": 1771670392224, "nome": "Olio catena bioplus 1 litro", "prezzo": 6, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1771670408727, "nome": "Guanti ", "prezzo": 3.9, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	358.9	\N	\N	\N	scontrino	completed	2026-02-21 10:40:26.358+00	t	user_1769961017929	vendita	f	f	f
1771664967655	2026-02-21 09:09:27.655+00	D'AMELIO Vincenzo	{"id": "502893", "cap": "31056", "nome": "D'AMELIO Vincenzo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3450818865", "indirizzo": "VIA PRINCIPE, 85/A - MUSESTRE", "provincia": "TV", "searchText": "d'amelio vincenzo roncade ", "telefonoOriginale": "3450818865"}	3450818865	Simone	[{"brand": "GGP", "model": "Trattorino XF 135 HD", "prezzo": 2200, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "25CA3RON005540"}]	[]	2200	400	pos	Contattare il cliente appena pronto per la consegna. Ritirare rider del cliente per rottamazione	scontrino	completed	2026-03-12 08:38:36.1+00	t	user_1770584612559	vendita	f	f	f
1772276586896	2026-02-28 11:03:06.587+00	Patruno Franco	{"id": "506125", "cap": "31048", "nome": "Patruno Franco", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3935553311", "indirizzo": "VIA TREVISO MARE, 8", "provincia": "TV", "searchText": "patruno franco san biagio di callalta ", "telefonoOriginale": "3935553311"}	3935553311	Simone	[{"brand": "STIHL", "model": "Decespugliatore FSA 60 R", "prezzo": 185, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "450921356"}]	[]	185	\N	\N	\N	scontrino	completed	2026-02-28 11:03:06.587+00	t	user_1769961017929	vendita	f	f	f
1771836731318	2026-02-23 08:52:11.318+00	Mareverde Srls	{"id": "501758", "cap": "30016", "nome": "Mareverde Srls", "email": "info@vivaisorgon.it", "nomeP": "", "cognome": "", "contatto": "Simone 335490390", "localita": "JESOLO", "telefono": "0421230013", "indirizzo": "Via Zuccarini, 11", "provincia": "VE", "searchText": "mareverde srls jesolo simone 335490390", "telefonoOriginale": "0421230013"}	0421230013	Simone	[{"brand": "Grillo", "model": "Trattorino FD500", "prezzo": 22326, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[{"id": 1771836586694, "nome": "Ritiro Vs trattorino usato GF PG280D", "prezzo": -14640, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	7686	1300	bonifico	consegna a febbraio (il cliente è stato avvisato che la consegna sarà spostata a marzo). Pagamento con ricevuta bancaria a 30-60 giorni	scontrino	pending	\N	t	user_1770584612559	vendita	f	f	f
1772698023760	2026-03-05 08:07:03.759+00	La Gemma Di Bianchin Mauro & C. Snc	{"id": "202369", "cap": "31049", "nome": "La Gemma Di Bianchin Mauro & C. Snc", "email": "info@gemmagiardini.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "VALDOBBIADENE", "telefono": "0423981412", "indirizzo": "STRADA ROSA 44 - BIGOLINO", "provincia": "TV", "searchText": "la gemma di bianchin mauro & c. snc valdobbiadene ", "telefonoOriginale": "0423981412"}	0423981412	Simone	[]	[{"id": 1772697630789, "nome": "Universal Top 20 kg", "prezzo": 56.5, "quantita": 4, "matricola": null, "aliquotaIva": 4}, {"id": 1772697650836, "nome": "Humifitos 25 Kg 25 kg", "prezzo": 103, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1772697668935, "nome": "Micosat F MO 5 kg", "prezzo": 140.4, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1772697688240, "nome": "Strong 10 kg", "prezzo": 81.5, "quantita": 1, "matricola": null, "aliquotaIva": 10}, {"id": 1772697704749, "nome": "Hurricane 7 10 kg", "prezzo": 104, "quantita": 1, "matricola": null, "aliquotaIva": 10}]	654.9	\N	\N	\N	fattura	completed	2026-03-05 08:07:03.759+00	t	user_1770584612559	vendita	f	f	f
1771857311156	2026-02-23 14:35:10.084+00	Cenedese Andrea	{"id": "500594", "cap": "31048", "nome": "Cenedese Andrea", "email": "andrea.cenedese@alice.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3318200684", "indirizzo": "VIA SAN MARTINO, 54 - SAN MARTINO", "provincia": "TV", "searchText": "cenedese andrea san biagio di callalta ", "telefonoOriginale": "3318200684"}	3318200684	Simone	[{"brand": "Volpi", "model": "Forbice elettronica KV360", "prezzo": 299, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PP4624.359NB"}]	[]	299	\N	\N	\N	scontrino	completed	2026-02-23 14:35:10.084+00	t	user_1769961017929	vendita	f	f	f
1771837124604	2026-02-23 11:00:00+00	COOP. Sociale Idee Verdi	{"id": "501441", "cap": "35030", "nome": "COOP. Sociale Idee Verdi", "email": "areacontabile@ideeverdi.it", "nomeP": "", "cognome": "", "contatto": "CEL. Marco Neve", "localita": "SELVAZZANO DENTRO", "telefono": "3450914123", "indirizzo": "VIA GALVANI, 16", "provincia": "PD", "searchText": "coop. sociale idee verdi selvazzano dentro cel. marco neve", "telefonoOriginale": "3450914123"}	3450914123	Simone	[{"brand": "Altro", "model": "Trattorino Ferris ISX 3300", "prezzo": 20740, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": null}]	[{"id": 1772079631434, "nome": "Kit lame di ricambio ad alto lancio", "prezzo": 0, "quantita": 1}]	20740	1830	bonifico	\N	fattura	pending	\N	t	user_1770584612559	vendita	f	f	f
1772794749226	2026-03-06 10:59:07.036+00	Jesolo Gest Arl	{"id": "504127", "cap": "30016", "nome": "Jesolo Gest Arl", "email": "simone.v@clubdelsole.com,", "nomeP": "", "cognome": "", "contatto": "CEL1 Dorin -049656070", "localita": "JESOLO", "telefono": "3299278952", "indirizzo": "VIALE ORIENTE, 144", "provincia": "VE", "searchText": "jesolo gest arl jesolo cel1 dorin -049656070", "telefonoOriginale": "3299278952"}	3299278952	Simone	[{"brand": "STIHL", "model": "Potatore HTA 86", "prezzo": 530, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "449457136"}, {"brand": "STIHL", "model": "Batteria AP 500 S", "prezzo": 344.27, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "548989613"}, {"brand": "STIHL", "model": "Batteria AP 500 S", "prezzo": 344.27, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "548989674"}, {"brand": "STIHL", "model": "Batteria AP 300.0 S (281 Wh)", "prezzo": 269.67, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "921008377"}, {"brand": "STIHL", "model": "Batteria AP 300.0 S", "prezzo": 269.67, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "920001603"}]	[{"id": 1772794630440, "nome": "Testina Polycut Stihl 28-2", "prezzo": 21, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1772794675699, "nome": "Testina Autocut 27-2", "prezzo": 14.1, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	1792.98	\N	\N	\N	fattura	completed	2026-03-06 10:59:07.036+00	f	user_1769961017929	vendita	f	f	f
1773045271126	2026-03-09 11:00:00+00	BARBON IVAN	\N	\N	Simone	[]	[{"id": 1773045119753, "nome": "Universal Top 20 kg", "prezzo": 59.4, "quantita": 11, "matricola": null, "aliquotaIva": 4}]	653.4	\N	\N	\N	scontrino	completed	2026-03-09 11:00:00+00	t	user_1773043211070	vendita	f	f	f
1773075750834	2026-03-09 17:02:30.833+00	BROLLO MARCO	{"cf": null, "id": "a0f77d7b-6122-46c8-afb6-ce56c6356b80", "cap": "31048", "sdi": null, "nome": "BROLLO MARCO", "piva": null, "email": null, "nomeP": "BROLLO MARCO", "localita": "SAN BIAGIO DI CALLALTA", "telefono": null, "indirizzo": "VIA FRIULI", "provincia": null, "searchText": "BROLLO MARCO"}	\N	Simone	[]	[{"id": 1773075593716, "nome": "Eden 7 5 kg", "prezzo": 15.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}, {"id": 1773075700238, "nome": "Micosat F prati & giardini 1 kg", "prezzo": 31.2, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	46.9	\N	\N	\N	scontrino	completed	2026-03-09 17:02:30.833+00	t	user_1773043211070	vendita	f	f	f
1773244078788	2026-03-11 15:47:58.787+00	Romanello Umberto	{"id": "508068", "cap": "31048", "nome": "Romanello Umberto", "email": "umbe.roma@yahoo.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3463719100", "indirizzo": "VIA FORNASATTA, 5", "provincia": "TV", "searchText": "romanello umberto san biagio di callalta ", "telefonoOriginale": "3463719100"}	3463719100	Simone	[]	[{"id": 1773244071793, "nome": "Green 7 25 kg", "prezzo": 47.7, "quantita": 1, "matricola": null, "aliquotaIva": 4}]	47.7	\N	\N	\N	scontrino	completed	2026-03-11 15:47:58.787+00	t	user_1769961017929	vendita	f	f	f
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
279	2026-03-11 08:26:36.855+00	CARICO	Honda	Rasaerba HRX476C2 HYEH	MBYF1064510	\N	\N	\N	available	user_1769961017929	main	t
281	2026-03-11 09:27:14.402+00	CARICO	Grillo	 Trimmer HWT600	695024	\N	\N	\N	available	user_1769961017929	main	t
283	2026-03-11 16:13:47.103+00	CARICO	Stihl	Decespugliatore FS 55 R	838434202	\N	\N	\N	available	user_1769961017929	main	t
284	2026-03-11 16:14:15.315+00	SCARICO	Stihl	Decespugliatore FS 55 R	838434202	Zanetti Sergio	0	0	sold	user_1769961017929	main	f
285	2026-03-12 08:38:36.1+00	SCARICO			25CA3RON005540	D'AMELIO Vincenzo	0	0	sold	user_1773303336355	main	f
286	2026-03-12 13:28:13.02+00	SCARICO			MBWF-1600622	Fantuzzo Luca	0	0	sold	user_1773313248876	main	f
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
277	2026-03-10 16:12:25.57+00	CARICO	Honda	Rasaerba HRN536C2 VYEH	MCSF1069705	\N	\N	\N	available	user_1769961017929	main	t
278	2026-03-10 16:12:43.197+00	SCARICO	Honda	Rasaerba HRN536C2 VYEH	MCSF1069705	Il Filo D'ERBA Di De Bernardo Sebastiano	0	0	sold	user_1769961017929	main	f
280	2026-03-11 08:27:03.353+00	SCARICO	Honda	Rasaerba HRX476C2 HYEH	MBYF1064510	Boccardelli Alessandro	0	0	sold	user_1769961017929	main	f
282	2026-03-11 09:28:45.472+00	SCARICO	Grillo	 Trimmer HWT600	695024	Pavan Claudio	0	0	sold	user_1769961017929	main	f
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
4ed127b1-9822-46e6-b035-e63919c39a53	STOCKER	Nebulizzatori	ST-00-29	Geyser Nebulizzatore Mini 2,5 bar 2 Lt.	2 Lt.	40.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
2d3acd47-ef87-4234-bdd2-d87652fe78f4	STOCKER	Nebulizzatori	ST-00-126	Geyser Nebulizzatore Verde 5 bar 4 Lt.	4 Lt.	170.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
20fc6abe-2433-44b0-b0af-e87976372ce4	STOCKER	Nebulizzatori	ST-00-167	Geyser Nebulizzatore Arancio 5 bar 12 Lt.	12 Lt.	225.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
0fe7baca-97ef-41e0-b550-530fd8838bc9	STOCKER	Nebulizzatori	ST-00-172	Geyser Nebulizzatore Verde 5 bar 12 Lt.	12 Lt.	232.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
736f0957-a80e-4dd8-98fa-1283a9e8bd8c	STOCKER	Nebulizzatori	ST-00-180	Geyser Nebulizzatore E-25 MI Arancio 5 bar 25 Lt.	25 Lt.	240.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
5f350c59-4107-4d2d-a865-0419c3b674fc	STOCKER	Nebulizzatori	ST-00-189	Geyser Nebulizzatore E-25 MI Verde 5 bar 25 Lt.	25 Lt.	250.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
04379c57-b419-4220-a0f4-bbb7a0cfc501	STOCKER	Nebulizzatori	ST-0-1190	Geyser Pro Nebulizzatore a 2 prodotti 12 bar	\N	1590.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
9dca011a-677c-404b-9f2c-0a506ab49741	STOCKER	Kit nebulizzazione	ST-00-12	Kit balcone Geyser 3 ugelli - mt. 10	mt. 10	18.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
b14af5f6-2bc0-44d8-ac67-9546c4e0f0ba	STOCKER	Kit nebulizzazione	ST-00-26	Kit balcone Geyser 10 ugelli - mt. 25	mt. 25	39.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
d375fa64-f519-428d-a360-7ab8bed78164	STOCKER	Kit nebulizzazione	ST-00-96	Kit balcone Geyser 40 ugelli mt. 100	mt. 100	139.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
09623127-4c22-49c7-9661-75a755f118e2	STOCKER	Accessori Geyser	ST-00-6.30	Cappuccio protettivo per Geyser lt. 25	\N	9.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
cff3cb4c-c893-4a8f-b507-5f35499b7964	STOCKER	Accessori Geyser	ST-00-43.2	Treppiede in alluminio Geyser	\N	58.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
aaf44a83-3008-4e0d-9e98-26227ec76fe4	STOCKER	Accessori Geyser	ST-00-2.90	Tappi di chiusura Geyser	\N	4.30	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
73f4040b-e4c0-47e0-bb79-79f71e0f4ae9	STOCKER	Accessori Geyser	ST-00-49	Batteria 21V - 2,6 Ah Geyser	\N	66.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
35002712-0c62-4297-a525-d4a70001025c	STOCKER	Accessori Geyser	ST-00-18	Caricabatterie doppio 21V Geyser	\N	25.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
28c97d9e-dc40-4868-940b-8e56ffe9cccc	STOCKER	Accessori Geyser	ST-00-92	Alimentatore Geyser Pro AC 220V - DC 21V	\N	124.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
7fc944c1-7a77-4cc2-a7db-7e3b6a0f70f5	STOCKER	Insetticidi	ST-00-27	Nebuzan repellente flacone da 1 litro	1 Lt.	39.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
a73db504-da6a-4955-af74-aab5f3d5d097	STOCKER	Insetticidi	ST-00-104	Nebuzan repellente tanica da 5 litri	5 Lt.	140.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
6e6f3427-5b86-42a1-a281-af28c6afafbf	STOCKER	Insetticidi	ST-00-11-FL	Florifens larvicida zanzare 50 ml.	50 ml.	14.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
7b0008cf-c81f-4829-b971-914efafd868e	STOCKER	Insetticidi	ST-00-137	Etokraft zanzaricida anti-zanzare PMC 5 litri	5 Lt.	185.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
63c9222e-54e2-4e2e-ae2f-bf177f965c6c	STOCKER	Insetticidi	ST-00-30	Pirekraft insetticida concentrato PMC 500 ml.	500 ml.	42.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
ded2c30a-8778-48ee-bda4-8a3f81b5584a	STOCKER	Raccorderia	ST-00-2.2	Ugelli anti-gocciolamento Ø 6 mm	\N	3.30	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
dd36a636-2aa9-4da3-a042-aa7646f047c8	STOCKER	Raccorderia	ST-00-3.8	Ugelli anti-gocciolamento 135° Ø 6 mm	\N	5.70	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
3a6f5e8e-81ab-4874-bc69-7723478ce8b1	STOCKER	Raccorderia	ST-00-0.69	Raccordo a T Ø 6-6-6 mm	\N	1.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
840be04d-9f55-4d37-bfcc-b7c2bfd6c0d8	STOCKER	Raccorderia	ST-00-0.63	Raccordo a 90° Ø 8 mm	\N	1.30	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
3cecc61e-d51c-42fe-89a1-595a58f14330	STOCKER	Raccorderia	ST-00-0.89A	Raccordo a T Ø 8-8-8 mm	\N	1.80	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
7a0f2430-8ecd-47fd-b4ee-34ed92dc247b	STOCKER	Raccorderia	ST-00-0.92	Raccordo a T Ø 6-8-6 mm	\N	1.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
d56d96e4-df82-41ac-9275-d68b1c841d0f	STOCKER	Raccorderia	ST-00-0.89B	Raccordo a T Ø 8-6-8 mm	\N	1.80	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
a25e8c18-4845-4032-8ef3-fff53ef70019	STOCKER	Raccorderia	ST-00-1.22	Raccordo a 135° Ø 6 mm	\N	2.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
b35f7f14-7f47-4e35-a7b8-46162a0d1c4d	STOCKER	Raccorderia	ST-00-0.65	Raccordo dritto Ø 6-8 mm	\N	1.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
373dc051-47e3-4668-8390-cdafb2b5a3d5	STOCKER	Raccorderia	ST-00-13.9	Palo prolunga ugello 100 cm con tubo e raccordo	\N	21.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
32a37332-7a47-490c-a685-a1181138a211	STOCKER	Raccorderia	ST-00-0.43A	Aste di prolungamento 40 cm Ø 6 mm	\N	1.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
77a9025e-2e29-4063-8c53-7d980650b19b	STOCKER	Raccorderia	ST-00-4.51	Kit direzionamento ugelli Geyser 2 tubi flessibili cm 19	\N	6.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
7f7c53bd-835c-4934-9f1b-6b042ce96843	STOCKER	Raccorderia	ST-00-5.50	Tubo nero Ø 6 mm - mt. 10	mt. 10	8.40	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
201d69b7-c3a1-4f60-b084-0e4c9356c3bd	STOCKER	Raccorderia	ST-00-11-TB	Tubo nero Ø 6 mm - mt. 25	mt. 25	15.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
6e9c7e7c-f3d8-47c0-a69e-8a6577a867ef	STOCKER	Raccorderia	ST-00-35	Tubo nero Ø 6 mm - mt. 100	mt. 100	52.70	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
30c9d8bf-f010-455f-8ce7-d11b61338e0e	STOCKER	Raccorderia	ST-00-57	Tubo nero Ø 8 mm - mt. 100	mt. 100	90.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
fe88ab99-2937-4874-a956-b9ef0e72c812	STOCKER	Raccorderia	ST-00-2.57	Picchetti fissatubo 20 cm per Geyser - 10 pz	10 pz	3.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
29578d64-a91a-4634-ac5f-e6d5de33e5ec	STOCKER	Raccorderia	ST-00-0.36	Fissatubo a P sfuso Ø 6 mm - 25 pz.	25 pz	0.55	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
8ad2880d-eb3b-44ce-b0b4-53edc73d13da	STOCKER	Raccorderia	ST-00-0.43B	Fissatubo a P sfuso Ø 8 mm - 25 pz.	25 pz	0.65	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
fadb8aca-6669-4495-9595-5042cca2e7c9	STOCKER	Raccorderia	ST-00-4.5	Valvola di non ritorno Ø 8 mm	\N	6.80	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
4a5e3536-6229-4e07-963c-94c31f51f080	STOCKER	Raccorderia	ST-00-33	Tubo Eos Anti Torsion 5/8" - mt. 25	mt. 25	49.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
d2b8c61c-283f-467d-869c-48a1c24b87ce	STOCKER	Raccorderia	ST-00-5.10	Raccordo rubinetto 2 uscite 1" - 3/4"	\N	7.70	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
320f1fbb-8615-4d63-b277-84dbd41f1a3d	STOCKER	Raccorderia	ST-00-2.69	Raccordo portagomma 1/2" - 5/8" - 3/4"	\N	3.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
f374d361-7c85-42cf-95e3-eb1ff864bc54	GGP	Accessori trattorini	LC1500B	Rimorchio LC 1500B 122x87	\N	500.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
5dfba749-bcaf-44b6-89e9-6e7ca5f1d045	GGP	Zero Turning	ZTX105SD	Zero Turning ZTX 105SD scarico lat. B&S 20HP bic. 92cm	\N	5350.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
16527740-8832-4340-ad5b-1be6e3964422	GGP	Zero Turning	ZTX105RD	Zero Turning ZTX 105RD scar.post.+mulch B&S 20HP bic. 92cm	\N	5500.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
6a983fc9-94a7-4062-91e2-f844827dcc5d	GGP	Zero Turning	ZTX175SD	Zero Turning ZTX 175SD scarico lat. B&S 20HP bic. 107cm	\N	6200.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
ef4dd4c4-74e7-4c32-8e4c-218ab8a0f88a	GGP	Zero Turning	ZTX175RD	Zero Turning ZTX 175RD scar.post.+mulch B&S 20HP bic. 107cm	\N	6350.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
d63e0f32-6309-4fbe-974b-7ac27a5f0b03	GGP	Zero Turning	ZTX275SD	Zero Turning ZTX 275SD scarico lat. B&S 24HP bic. 122cm	\N	7330.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
913e50fb-2f95-4ea9-b5de-449b37df6837	FREEZANZ	Nebulizzatori	FZ-ZHALT-PORTABLE	Zhalt Portable Connect	\N	420.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
1cd5f7a0-5bba-456d-b08f-9aceb6b3dd90	FREEZANZ	Kit nebulizzazione	FZ-KIT-GARDEN-25	Kit Garden Extension mt. 25 - 6 ugelli	\N	169.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
d1d845f9-aef6-47b9-afa0-e5a02cd9d792	FREEZANZ	Nebulizzatori	FZ-ZHALT-EVO	Zhalt Evolution Connect + Kit 10 ugelli	\N	1400.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
850a5c47-d655-4c33-ae55-eb5984b84ee2	FREEZANZ	Kit nebulizzazione	FZ-KIT-EXPANDING	Kit Expanding 10 ugelli	\N	270.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
eb4c7813-5d25-4c9b-8bad-f22f4aa9234d	FREEZANZ	Raccorderia	FZ-TUBO-1/4	Tubazione 1/4 nero al mt.	al mt.	1.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
1b71ddfe-ec4a-4cc4-adcc-4656a85c7f70	FREEZANZ	Raccorderia	FZ-RACCORDO-USC	Raccordo speciale uscita	\N	12.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
986f13a0-1600-4b25-b8cb-159721368536	FREEZANZ	Accessori	FZ-TUBETTI-VERDE	Tubetti verdi di rialzo da cm. 150	\N	4.50	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
6c1eed0a-3fe9-427a-8f0a-842c12b0afa8	FREEZANZ	Insetticidi	FZ-TETRAPIU	Tetrapiù PMC (Reg. Min. Salute N. 11826) - Lt. 5	Lt. 5	23.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
a1eb2a53-af1c-45e4-9320-61114064d28d	FREEZANZ	Insetticidi	FZ-PRO-PMC	Freezanz Professional PMC (New) - Lt. 1	Lt. 1	54.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
9b841e39-da91-43ee-8720-591d63da1c96	FREEZANZ	Prodotti naturali	FZ-NAT-GREEN	Freezanz Natural Green - Lt. 1	Lt. 1	25.90	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
bbc537e4-f349-4955-ba2f-f36a700fdc3b	FREEZANZ	Prodotti naturali	FZ-NAT-GREEN+	Freezanz Natural Green+ - Lt. 5	Lt. 5	158.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
ee4868c1-43f2-4214-b5ac-6c42c8d4cc46	FREEZANZ	Raccorderia	F01RA1001	Raccordo giunzione intermedio diritto 1/4"	\N	4.70	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
774ebad7-ed9b-4a1d-821b-f53cde2360b2	FREEZANZ	Raccorderia	F01RA1011	Adattatore per ugello diritto 1/4"	\N	3.05	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
482040c4-38b2-4701-859c-2eec18622da0	FREEZANZ	Raccorderia	MQ300126	Raccordo inizio 1/4" tubo x 1/4" M	\N	5.10	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
de5d2c64-8192-4f0e-8df9-3b56457727e6	FREEZANZ	Raccorderia	MQ300109	Tappo fine linea 1/4" ad incastro	\N	2.30	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
36958b27-09b7-481b-b872-594fa2db9eae	FREEZANZ	Raccorderia	MQ400109	Valvola di intercettazione da 1/4"	\N	15.85	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
2ff8b003-32e0-47aa-86d5-9eb6b8ba87f7	FREEZANZ	Raccorderia	MQ300110	Adattatore per ugello 45° 1/4" x 10/24"	\N	5.10	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
9ed74ab2-2b24-4e26-8f1c-135f2185a9e8	FREEZANZ	Raccorderia	EC080007	Tappo esclusione ugello ottone nichelato 10/24"	\N	1.60	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
084d3896-9ef9-4243-b100-ea1645211428	FREEZANZ	Raccorderia	MQ300103	Raccordo giunzione tubo da 1/4"	\N	6.10	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
1528a987-2666-4752-8d93-293d9ebeec66	FREEZANZ	Raccorderia	MQ300105	Raccordo curva L 90° 1/4"	\N	7.65	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
bee2b78a-0a0f-46f2-a1fa-125f403f9193	FREEZANZ	Raccorderia	MQ300139	Raccordo tappo fine linea tubo 1/4"	\N	4.60	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
af3c985c-d4ac-41a3-94b6-719fbae3af32	FREEZANZ	Raccorderia	MQ400114	Tubo Mister Mosquito nero 1/4 - 40 bar 50 mt	50 mt	84.00	\N	\N	\N	22.00	2026-03-12 13:35:23.59584+00	\N	\N	\N
2f1063ee-ae61-4e0d-bc50-536abbb91dbf	HONDA	Generatori	EU10IK1	Generatore insonorizzato EU 10 IK1 0,9 KVA 49cc	\N	1180.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
7f98778b-9485-4229-84aa-1ea579563e6f	HONDA	Generatori	EU22I	Generatore insonorizzato EU 22i 1,8 KVA 121cc	\N	1600.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
b270d90d-628e-48c4-a71e-c3c4e6f98b5a	HONDA	Generatori	EU32I	Generatore insonorizzato EU 32i 2,6 KVA 130cc	\N	3520.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
68cb3ecc-74d7-4309-acb3-5a2fc69e26bb	HONDA	Generatori	EU30IS	Generatore insonorizzato EU 30 IS 4 ruote 2,8 KVA 196cc	\N	2830.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
b69ae1a1-6be5-4b12-aabd-6e04301353ac	HONDA	Generatori	EU70ISTROLLEY	Generatore insonorizzato EU 70 IS IT Trolley 5,5 KVA 389cc	\N	4690.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
dcc0bbbb-f643-4915-8d8b-c1403dc7c5ac	HONDA	Generatori	ATS	Centralina ATS Honda	\N	690.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
803b275d-9d06-47c5-9dcf-d63692e00231	HONDA	Generatori	EG3600IT	Generatore a telaio EG 3600 IT 3,6 KVA 270cc	\N	1500.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5a20c2a3-0143-4a88-8119-a8c8dd8ce881	HONDA	Generatori	EG4500IT	Generatore a telaio EG 4500 IT 4,5 KVA 390cc	\N	1620.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
8fc581aa-9c56-4e3f-8819-74dbf451669a	HONDA	Generatori	EG5500IT	Generatore a telaio EG 5500 IT 5,5 KVA 390cc	\N	1880.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
f948b607-a093-4bfc-830a-439e5dd75142	HONDA	Generatori	TROLLEY-GEN	Trolley per generatore Honda	\N	175.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
8ee7258d-90c3-4d58-b704-2e846d5c602d	HONDA	Motopompe	WX10K1E1T	Motopompa acque pulite WX 10 K1 E1T 25mm 25cc	\N	500.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
4cbd9c42-6e7f-455e-a7a7-5305eb7d6c24	HONDA	Motopompe	WX15E1R	Motopompa acque pulite WX 15 E 1R 40mm 49cc	\N	620.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5ff240d5-652a-4cc5-b869-1538a82f5153	HONDA	Motopompe	WB20XTDRX	Motopompa acque pulite WB 20 XT DRX 50mm 3,5HP	\N	640.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
9f4928d2-027f-47e0-9f3a-a4217fccde98	HONDA	Motopompe	WB30XTDRX	Motopompa acque pulite WB 30 XT DRX 80mm 4,8HP	\N	740.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5964d72b-419b-41c3-946a-05c033fe967d	HONDA	Motopompe	WH20XK1J	Motopompa acque pulite WH 20 XK1J DXE1 50mm 4,8HP	\N	920.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
bbc244e1-9870-4f95-9d43-a4a6441ade4f	HONDA	Motopompe	CARRELLO-POMP	Carrello trasporto motopompa Honda	\N	175.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
45aff72b-1b14-4859-9c84-9c74376c62ec	HONDA	Motopompe	WT20XK3DE	Motopompa acque sporche WT 20 XK3 DE 50mm 4,8HP	\N	1570.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
b6c3d9fa-aef8-4bba-9660-862351d1d77e	HONDA	Motopompe	WT30XK3DE	Motopompa acque sporche WT 30 XK3 DE 80mm 7,1HP	\N	2000.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
03ced4ae-8072-45ec-9a33-9b60f518dc64	HONDA	Motopompe	WT40XK2DE	Motopompa acque sporche WT 40 XK2 DE 100mm 9,5HP	\N	2950.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
a5c1c606-0c73-43d9-b6d2-ac3a22e91b29	HONDA	Motopompe	WMP20X1	Motopompa travaso liquidi corrosivi WMP 20 X1 50mm 4,8HP	\N	820.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
1ff688ab-3f17-45e4-9d51-47e5ccbd149a	HONDA	Motozappe	FG201DE	Motozappa FG 201 DE 30cm 49cc avv. strappo	\N	660.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
9c14e761-8c3e-4f87-9c5c-13cc64662b55	HONDA	Motozappe	FG205DE	Motozappa FG 205 DE 45cm 49cc avv. strappo	\N	810.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
8c4044b9-6857-4a3f-b446-decf30790b76	HONDA	Motozappe	F220GE	Motozappa F 220 GE 52cm 57cc avv. strappo	\N	1000.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
b2cce39f-2999-45c7-aeee-cf3c446ff152	HONDA	Motozappe	FG320	Motozappa FG 320 1+1 80cm 160cc	\N	740.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
b735698e-c2f8-44ae-b540-f1032d9ea707	HONDA	Motozappe	FJ500SE	Motozappa FJ 500 SE 1+1 90cm 163cc	\N	1230.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
60f004e3-2f55-41ba-8bdf-fc70430d6803	HONDA	Motozappe	FJ500DE	Motozappa FJ 500 DE 2+1 90cm 163cc	\N	1500.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
e43c0c13-e687-4844-81ac-db1303c6fee6	HONDA	Motozappe	F501K4GE	Motozappa F 501K4 GE 2+1 90cm 163cc	\N	1500.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
f43b48a1-1efb-481a-a357-144876a4f391	HONDA	Motozappe	FF300DE	Motozappa anteriore FF 300 DE 3+1 45cm 57cc	\N	2350.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
090fe943-80f1-4545-89f5-a44fa3aa2ddc	HONDA	Motozappe	FF500DE	Motozappa anteriore FF 500 DE 3+1 55cm 160cc	\N	2800.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
9f4f0844-6c26-4840-a3ff-1c1f200a06ee	HONDA	Soffiatori	HHB25E	Soffiatore Honda HHB 25 E 4T 25cc	\N	449.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5450c692-288f-4b30-85fd-4dc75f31b396	HONDA	Decespugliatori	UMS425ELE	Decespugliatore curvo 4T UMS 425 E LE 25cc	\N	320.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
6584afb0-3112-47ca-834a-54375da824ee	HONDA	Decespugliatori	UMK425ELE	Decespugliatore 4T UMK 425 E LE 25cc	\N	440.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
c64165ac-0432-45bc-8e81-72f60bcfa1b3	HONDA	Decespugliatori	UMK435ELE	Decespugliatore 4T UMK 435 E LE 36cc	\N	540.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
d2374564-7180-4270-b66b-896e94b22294	HONDA	Decespugliatori	UMK450LEET	Decespugliatore 4T UMK 450 LE ET 50cc	\N	640.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
221e029d-1047-46f1-9d9d-feecb46c2906	HONDA	Decespugliatori	UMR435T	Decespugliatore spalleggiato 4T UMR 435 T 36cc	\N	540.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
7942adf6-e28a-4d3d-afdf-fee35872c9bc	HONDA	Accessori decespugliatori	ACC-TAGLIASIEPI-425	Accessorio tagliasiepi x 425/435	\N	300.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
4844377a-134b-4c23-b4ce-533961945ac5	HONDA	Accessori decespugliatori	ACC-MOTOSEGA	Accessorio motosega Honda	\N	250.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
747b2f09-a3d4-493b-9486-c136532b1d4b	HONDA	Multifunzione	UMC425E	Multifunzione UMC 425 E 25cc	\N	360.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
717d2721-1a09-4643-b203-2833fd5f0826	HONDA	Multifunzione	UMC435E	Multifunzione UMC 435 E 35cc	\N	450.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
54da5428-0b9d-4078-8196-c03c24ece0b4	HONDA	Accessori multifunzione	ACC-ASTA-FILO	Asta filo BC Honda	\N	110.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5cfd7672-694c-44bf-8dcb-f08018ee2f5d	HONDA	Accessori multifunzione	ACC-POTATORE	Potatore PP Honda	\N	260.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
fb41d6e6-838c-45ef-a4c3-85017b63b84d	HONDA	Accessori multifunzione	ACC-TS-CORTO	Tagliasiepi albero corto HH SE Honda	\N	300.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
c9b52f64-081b-4810-935a-b88c8a872d86	HONDA	Accessori multifunzione	ACC-TS-LUNGO	Tagliasiepi albero lungo HF LE Honda	\N	310.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
8027c014-9abd-451d-b529-ed97854a059e	HONDA	Accessori multifunzione	ACC-SOFFIATORE	Soffiatore BL Honda	\N	135.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
85f148ef-e512-4ba4-8709-264c6adaa0c4	HONDA	Accessori multifunzione	ACC-FRESA	Fresa CL Honda	\N	180.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
3e4f0771-7072-4471-83c8-919d5e7e9312	HONDA	Accessori multifunzione	ACC-PROL-50	Prolunga cm 50 ES SE Honda	\N	85.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
3fada626-33a5-4861-83d5-0a0cd93d446b	HONDA	Accessori multifunzione	ACC-PROL-100	Prolunga cm 100 ES LE Honda	\N	110.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
4c27cb2b-ebea-4109-8b63-3d9d63007ff9	HONDA	Rasaerba	HRG416PKEHC1	Rasaerba IZY HRG 416 PK EH C1 spinta 41cm 145cc	\N	440.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
9f41361b-269f-4537-a886-b6b095e99f20	HONDA	Rasaerba	HRG416SKEHC1	Rasaerba IZY HRG 416 SK EH C1 1vel. 41cm 145cc	\N	540.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
1fd8b1b0-2407-4ec2-a591-333b9cf27c52	HONDA	Rasaerba	HRG466PKEHC1	Rasaerba IZY HRG 466 PK EH C1 spinta 46cm 145cc	\N	540.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
e3dce1b5-8e5f-4781-b0d7-ecb3d4c3edaf	HONDA	Rasaerba	HRG466SKEHC1	Rasaerba IZY HRG 466 SK EH C1 1vel. 46cm 145cc	\N	640.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
684b4075-dd3f-4300-a110-c50b2592fcf6	HONDA	Rasaerba	HRG466SKKEP	Rasaerba IZY HRG 466 SKK EP C1 Premium 1vel. 46cm 145cc	\N	740.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
febb4d7e-c6ea-4e43-96d7-8ecb234926ac	HONDA	Rasaerba	HRN536CVK	Rasaerba HRN 536 C VK Varia 53cm 170cc	\N	890.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
27f2800b-23ba-474a-b83b-606cdd9709e9	HONDA	Rasaerba	HRN536CVY	Rasaerba HRN 536 C VY Frizione lama Varia 53cm 170cc	\N	1000.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
549f85b7-d50c-434e-a929-f4853621220a	HONDA	Rasaerba	HRX476C2VYEH	Rasaerba HRX 476 C2 VY EH Varia 47cm 170cc	\N	1120.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
9cea57a8-f4cc-4299-9cce-b78214bc9132	HONDA	Rasaerba	HRX476C2HYEH	Rasaerba HRX 476 C2 HY EH Idro 47cm 170cc	\N	1280.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
980235e4-8769-48b1-a928-d7817da4b8c1	HONDA	Rasaerba	HRX537C5VKEA	Rasaerba HRX 537 C5 VK EA Varia 53cm 200cc	\N	1100.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
cc2c0122-4b1c-4c1e-8c09-9633d28dc350	HONDA	Rasaerba	HRX537C5VYEA	Rasaerba HRX 537 C5 VY EA Varia 53cm 200cc	\N	1380.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
086718ed-8106-4ac4-87eb-7f60fd0d6131	HONDA	Rasaerba	HRX537C5HYEA	Rasaerba HRX 537 C5 HY EA Idro 53cm 200cc	\N	1520.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
6ec5d4ad-d20c-4089-ae03-59fb3f1ae1cd	HONDA	Rasaerba	HRX537C5HZEA	Rasaerba HRX 537 C5 HZ EA Avv.elett. Idro 53cm 200cc	\N	1780.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
7f8e510f-d577-4e24-af0a-ab5cf359d317	HONDA	Rasaerba	HRD536C3HXE	Rasaerba HRD 536 C3 HXE Idro 53cm 160cc	\N	1520.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
5844103e-fd41-49de-a409-9b0ee935fc8a	HONDA	Rasaerba	HRH536K4HXE	Rasaerba HRH 536 K4 HXE Prof. Idro 53cm 160cc	\N	2180.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
1b66bf67-049f-4ed0-9bf9-f82e7edbc7e5	HONDA	Rasaerba	UM536K3EE2	Rasaerba 3 ruote UM 536 K3 EE 2vel. 53cm 160cc	\N	2100.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
ade9ac54-b4a4-4da0-a781-1c33dbcee4d6	HONDA	Rasaerba	UM616K3EBE2	Rasaerba 3 ruote UM 616 K3 EB E2 Idro 53cm 160cc	\N	2650.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
010255ff-8c8a-4443-b5ed-83660807bf33	HONDA	Trattorini	HF2317HME	Trattorino HF 2317 HM E Idro 530cc 92cm	\N	4200.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
0d6a7fb2-a52f-4cd1-a58d-287dbf845a55	HONDA	Trattorini	HF2417K5HME	Trattorino HF 2417 K5 HM E Idro 530cc 102cm	\N	5300.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
c0845921-8a4b-477b-b1b3-683cfc7b9c7f	HONDA	Trattorini	HF2417K5HTE	Trattorino HF 2417 K5 HT E SC.El. Idro 530cc 102cm	\N	5650.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
97f0d20f-1fa1-4181-b4d4-e69b8d7c14ab	HONDA	Trattorini	HF2625HMEH	Trattorino HF 2625 HM EH Idro 690cc 122cm	\N	6350.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
f17c05c8-e9a9-4cb2-8dbc-e8f7b4c16d1c	HONDA	Trattorini	HF2625HTEH	Trattorino HF 2625 HT EH SC.El. Idro 690cc 122cm	\N	6500.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
83e9a53b-d7fc-457b-a400-9af294be1bd1	HONDA	Accessori trattorini	KIT-MULCH-HF2317	Kit Mulching HF 2317	\N	140.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
58467921-7025-4268-94c7-9795fb399538	HONDA	Accessori trattorini	DEFL-SCARICO	Deflettore scarico Honda	\N	70.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
e50ac679-32c0-4e4d-8280-25cf479e5d33	HONDA	Accessori trattorini	GANCIO-TRAINO	Gancio traino Honda	\N	50.00	\N	\N	\N	22.00	2026-03-12 14:06:46.462164+00	\N	\N	\N
180bea54-4fd3-42fe-941d-9d5b32074e05	GGP	Rasaerba	XP40	Rasaerba elettrica XP 40 spinta 1600W 38cm	\N	175.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
be6752f6-5fff-49ee-ad11-63bb42b8eefb	GGP	Rasaerba	XC43	Rasaerba XC 43 spinta 123cc OHV 41cm	\N	285.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
e87ee8a2-e2fb-4a9d-80ba-f4b7b8ca8cc0	GGP	Rasaerba	XC48	Rasaerba XC 48 spinta 123cc OHV 46cm	\N	310.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
b6d04120-a1af-4dbe-a47f-b302cc079bb0	GGP	Trattorini	RIDER-COMBI166HD	Rider Stiga Combi 166 HD Idro 8HP 66cm	\N	1900.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
b54d6b54-5085-4255-969c-f42e2200e6c0	GGP	Trattorini	XF135HD	Rider GGP XF 135 HD Stiga Idro 13HP 72cm	\N	2300.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
21876c0a-4e8d-4f83-80bc-5474313c5f4b	GGP	Trattorini	XDC150HD	Trattorino GGP XDC 150 HD Idro 14,5HP 84cm	\N	2700.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
c69ee47d-8e9c-4b01-95b7-c8fada73fba6	GGP	Trattorini	XDC180HD	Trattorino GGP XDC 180 HD Idro 18HP bic. 98cm	\N	3500.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
13f45b29-789f-4013-88cb-d76408c5c793	GGP	Trattorini	PTX210HD	Trattorino GGP PTX 210 HD Idro 18HP bic. 102cm	\N	4300.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
c61e2d4f-016d-4158-a4e4-ebe5e44dca5c	GGP	Accessori trattorini	KIT-MULCH-TAPPO	Kit Mulching solo tappo cm 72/84/92/102/122	\N	85.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
9cf07208-1245-40f5-9482-f67f041b853f	GGP	Accessori trattorini	KIT-MULCH-LAME	Kit Mulching lame + tappo 72/84/92/102/122	\N	130.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
2fd76acd-35aa-47a4-a3a8-1ad24f3d0dee	GGP	Accessori trattorini	KIT-PARASASSI	Kit Parasassi cm 84/92/102/122	\N	140.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
cb075d98-f3e4-439a-a0cc-a7a0e208d010	GGP	Accessori trattorini	KIT-TRAINO-GGP	Kit traino GGP	\N	65.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
3ff4eb61-88c1-4228-8bec-7991c85f6118	GGP	Trattorini	XD150HD	Trattorino GGP XD 150 HD Idro 14HP 98cm scarico lat.	\N	2300.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
e9d66e44-5ea4-4ba9-b17a-caf7d7f32f1d	GGP	Trattorini	XDL210HD	Trattorino GGP XDL 210 HD Idro 18HP bic. 108cm scarico lat.	\N	3100.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
6bf89149-0d5d-4cc9-9814-2696aab112c8	GGP	Accessori trattorini	TAPPO-MULCH-9898	Tappo Mulching 98/108	\N	60.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
2b429a7f-62b1-4b63-9d35-cb6a1907b949	GGP	Accessori trattorini	KIT-TRAINO-LAT	Kit traino scarico laterale	\N	60.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
182bd35b-6ae4-4120-a7b6-45062a5b2ac5	GGP	Trattorini	PARK500W	Trattorino Stiga Park 500 W Idro 18HP bic. 100cm frontale	\N	5300.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
2516ddb9-95f4-42cc-8efc-59e28138d397	GGP	Accessori trattorini	LDC1002	Rimorchio LDC1002 102x76	\N	400.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
b2f0a726-35cd-4739-86be-65a4b0974a36	GGP	Zero Turning	ZTX275RD	Zero Turning ZTX 275RD scar.post.+mulch B&S 24HP bic. 122cm	\N	7400.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
207e9bcd-48aa-4429-86f5-4c79f19c8380	GGP	Zero Turning	ZTX350	Zero Turning ZTX 350 scarico lat. B&S 27HP bic. 132cm	\N	8400.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
c96cd1dd-5345-4324-b712-78d39f517335	GGP	Accessori trattorini	KIT-MULCH-ZTX	Kit Mulching ZTX	\N	430.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
1ca48515-47c1-4fc4-a8ea-efd2ad3a2bb8	WEIBANG	Rasaerba	WB537SCVMLV-G	Rasaerba Mulching 3v. WB537SCVMLV 196cc 53cm	\N	1120.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
0ce070d3-1c49-42c3-a63e-bb9f97f7824d	WEIBANG	Falciatrici	WBBC537SCV-G	Trinciaerba cardano 3v. WBBC537SCV 196cc 53cm	\N	1350.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
e2d585b6-d738-4568-9a64-1b195cab0ffc	WEIBANG	Arieggiatori	WB486CRC-G	Arieggiatore lame mobili WB486CRC 163cc 47cm	\N	1150.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
71899647-6eda-4228-b25c-c5525787d78f	WORX	Soffiatori	WG505E	Soffiatore/aspiratore WG 505E 220V 3000W	\N	120.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
7548979c-fc4a-4064-8f2d-8676a1b79bb2	WORX	Soffiatori	WG547E	Soffiatore WG 547E 1 batt. 2Ah	\N	139.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
c5eb530b-4055-44a6-a159-a15b187a21a4	WORX	Soffiatori	WG543E	Soffiatore WG 543E 1 batt. 4Ah	\N	210.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
8394ada0-f347-4ca9-98ab-16d04e897686	WORX	Motoseghe	WG894.9E	Seghetto a gattuccio WG894.9E	\N	85.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
7eeecd81-41f5-4bf9-84e0-872a9c74ce34	WORX	Potatori	WG330E	Forbice WG330E 1 batt. 2Ah + carica	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
3d4b5551-300b-4aa0-8f95-830f11344e3e	WORX	Potatori	WG325E	Potatore a catena WG325E 1 batt. 2Ah + carica 20cm	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
1ad862f6-5e10-4791-92df-2c2adbb3958c	WORX	Potatori	WG349E	Potatore ad asta WG349E 1 batt. 2Ah + carica	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
9153d43d-f5c6-4f2d-a392-28770551a1a2	WORX	Tagliasiepi	WG252E	Tagliasiepe telescopico WG252E 1 batt. 2Ah + carica 45cm	\N	180.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
fa179cf6-48a9-4af1-b343-190fd6dd6e01	WORX	Tagliasiepi	WG264E	Tagliasiepi WG264E 1 batt. 2Ah +/- 40 min.	\N	180.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
8d984268-1455-48c7-a652-b9f050a122cb	WORX	Utensili	WX352	Trapano avvitatore WX352 2 batt. 2Ah + carica	\N	235.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
f3110b9d-3737-4fbe-930f-9205e4b36088	WORX	Utensili	WX352.9	Trapano avvitatore WX352.9	\N	140.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
97fcbe1c-1b17-42a7-9bd6-4713c6e0d1bb	WORX	Idropulitrici	HIDROSHOT	Lancia pressione Hidroshot	\N	160.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
8a086715-694b-4419-a2b6-744d5a7a8153	WORX	Decespugliatori	WG119E	Trimmer elettrico WG 119E 220V 550W	\N	85.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
69d9c92b-c1bf-41ce-b2e7-49275eb07ca2	WORX	Decespugliatori	WG157E	Trimmer WG157E 1 batt. 2Ah 30 min.	\N	110.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
ab23fa29-f343-4c81-9222-c0d40e301c49	WORX	Decespugliatori	WG163E	Trimmer WG163E 2 batt. 2Ah 60 min.	\N	150.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
3c79e7bc-13f9-4fd5-b804-e72716c298f7	WORX	Batterie	KIT-POWER20	Kit Power 20 (1 batt. 2Ah + 1 carica)	\N	75.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
836fdb96-db42-4674-a0dd-0485f75c59fe	WORX	Batterie	BATT-2AH-20V	Batteria 2Ah 20V Worx	\N	50.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
6b918d34-31d5-4ac2-89a0-5c9852685dd5	WORX	Batterie	BATT-4AH-20V	Batteria 4Ah 20V Worx	\N	80.00	\N	\N	\N	22.00	2026-03-12 14:07:05.091801+00	\N	\N	\N
4cafb52f-4089-41fc-8ebc-7f4588991cf0	HONDA	Robot rasaerba	HRM1000E	Robot rasaerba Honda Miimo HRM 1000E NEW 1000 m/q	1000 m/q	799.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
c64bf2ef-625d-4369-bc65-a74367156175	HONDA	Robot rasaerba	HRM1500	Robot rasaerba Honda Miimo HRM 1500 NEW 1500 m/q	1500 m/q	1300.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
fb879db7-9ee6-4a55-bc55-69a92ee6092b	HONDA	Robot rasaerba	HRM2500	Robot rasaerba Honda Miimo HRM 2500 NEW 2500 m/q	2500 m/q	2200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
ba9ef082-03b4-404e-9f94-7b0bb1eed0e5	HONDA	Robot rasaerba	HRM1500EC	Robot rasaerba Honda Miimo HRM 1500 EC NEW 1500 m/q	1500 m/q	1700.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
63c27492-4515-401f-b143-a740f5034bf9	HONDA	Robot rasaerba	HRM2500EC	Robot rasaerba Honda Miimo HRM 2500 EC NEW 2500 m/q	2500 m/q	2560.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
5b722c6b-348a-4e46-9a32-1ca85b9d14db	HONDA	Robot rasaerba	HRM4000EC	Robot rasaerba Honda Miimo HRM 4000 EC NEW 4000 m/q	4000 m/q	3100.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
5a5cc2f3-8ac8-426a-9966-215de327af88	HONDA	Accessori robot	COPERTURA-40-70	Copertura stazione Miimo 40/70	\N	167.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
07f93c28-15be-45c1-8847-d87e02da74ee	HONDA	Accessori robot	COPERTURA-310-520	Copertura stazione Miimo 310/520/3000	\N	240.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
831324d4-a3ad-444a-80bf-75547459ab1e	SEGWAY	Robot rasaerba	NAVIMOW-108J	Navimow 108 J + kit 4G 800 m/q 5,1Ah 18cm	800 m/q	1000.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
00a0dc99-50ad-41a8-a06d-b372f3a711a4	SEGWAY	Robot rasaerba	NAVIMOW-I210AWD	Navimow I210 AWD 1000 m/q 18cm	1000 m/q	1200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
7643514e-f21f-4334-abe2-3319774b4dbe	SEGWAY	Robot rasaerba	NAVIMOW-H1500E	Navimow H1500E + Vision Fence 1500 m/q 7,65Ah 21cm	1500 m/q	1900.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
0b5b72a4-ecb5-4c58-b593-9fa8e29f1a6f	SEGWAY	Robot rasaerba	NAVIMOW-H206E	Navimow H 206E 600 m/q	600 m/q	1700.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
87490a58-5166-49aa-8a63-61cba1caaa13	SEGWAY	Robot rasaerba	NAVIMOW-H210E	Navimow H 210E 1000 m/q	1000 m/q	1900.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
922fcc1a-fe71-4e2b-8130-dd492e912e5a	SEGWAY	Robot rasaerba	NAVIMOW-H215E	Navimow H 215E 1500 m/q	1500 m/q	2200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
dfbf376c-7a60-4b54-ae3b-ef4fe8a7ed2f	SEGWAY	Robot rasaerba	NAVIMOW-H230E	Navimow H 230E 3000 m/q	3000 m/q	2600.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
3f2e266c-8916-4cbf-b9a5-469791524361	SEGWAY	Robot rasaerba	NAVIMOW-X3-315E	Navimow X3 315E 1500 m/q 6Ah 23,7cm	1500 m/q	2300.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
d78662ea-05ed-42d8-8920-9a613f8bc0b3	SEGWAY	Robot rasaerba	NAVIMOW-X3-330E	Navimow X3 330E 3000 m/q 8Ah 23,7cm	3000 m/q	2800.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
39c0173b-6ddb-4feb-b487-ea42163a80aa	SEGWAY	Robot rasaerba	NAVIMOW-X3-350E	Navimow X3 350E 5000 m/q 10,4Ah 23,7cm	5000 m/q	3300.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
8197bdce-b221-47fa-891d-7d675773ab1f	SEGWAY	Robot rasaerba	NAVIMOW-X3-390E	Navimow X3 390E 10000 m/q 12,8Ah 23,7cm	10000 m/q	4200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
9c718f86-3abd-4cb8-a86f-7130bab2cb78	SEGWAY	Robot rasaerba	NAVIMOW-X420E	Navimow X420E AWD 2000 m/q	2000 m/q	2500.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
85ac699e-c11d-4103-a692-34c76737c938	SEGWAY	Robot rasaerba	NAVIMOW-X430E	Navimow X430E AWD 3000 m/q	3000 m/q	2800.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
9ccc1456-8a9e-4e72-b50f-3b42d0ed2e77	SEGWAY	Robot rasaerba	NAVIMOW-X450E	Navimow X450E AWD 5000 m/q	5000 m/q	3200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
21052d05-0bc8-41ec-85a4-c288e4f70365	SEGWAY	Robot rasaerba	TERRANOX-120M1	Navimow Terranox CM 120 M1 AWD 12000 m/q 43cm	12000 m/q	5500.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
3225dbe8-2b5f-4906-8309-350669453e7c	SEGWAY	Robot rasaerba	TERRANOX-240M1	Navimow Terranox CM 240 M1 AWD 24000 m/q 43cm	24000 m/q	7000.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
5841397e-3194-4784-a780-7233cdab7cd9	SEGWAY	Accessori robot	NAV-KIT-ANTENNA	Kit estensione antenna Navimow 754840	\N	50.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
80dea37e-e75a-453a-81b0-e8f4f0a389e6	SEGWAY	Accessori robot	NAV-PROL-ANTENNA	Prolunga cavo antenna Navimow 754880	\N	30.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
73cc8911-7ab7-41dd-ac90-4cfd7148d1c9	SEGWAY	Accessori robot	NAV-VISION-FANCE	Kit Vision Fance Navimow 754920	\N	290.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
b4b33286-9154-4d5a-836c-42b60c3ccc67	SEGWAY	Accessori robot	NAV-KIT-USS	Kit sensori ultrasuoni Navimow 754860	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
1ed71ef6-0ca5-45c7-bfa7-8c937b640218	SEGWAY	Accessori robot	NAV-GARAGE-S	Garage S Navimow 755200	\N	150.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
5cec1f81-d77c-47b1-82b3-8abee067c776	SEGWAY	Accessori robot	NAV-GARAGE-M	Garage M Navimow 755210	\N	200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
b2612e50-0406-44c0-91f2-86564dca3676	SEGWAY	Accessori robot	NAV-GARAGE-L	Garage L X3 Navimow 755310	\N	250.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
2c98f7ac-c3ec-4e99-b235-fe51fe476921	SEGWAY	Accessori robot	NAV-KIT-TRIMMER-X3	Kit Trimmer X3 755390	\N	300.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
d53f36c8-3c89-461a-90e7-fd32bc887b3a	SEGWAY	Accessori robot	NAV-ANTENNA-SEC-X3	Kit antenna secondaria X3 755380	\N	300.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
1ed215ae-e0ab-4926-a49d-022da95c8905	SEGWAY	Accessori robot	NAV-ADATT-ANT-X3	Adattatore trasformatore antenna X3 755330	\N	30.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
3e4ac52a-6180-48e5-b314-2f8a8a919dd3	SEGWAY	Accessori robot	NAV-EST-ANT-10M	Kit estensione antenna 10mt X3 755320	\N	30.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
cfdd349a-5bea-4a65-bed0-4bfbe333633a	SEGWAY	Accessori robot	NAV-KIT-MONT-ANT	Kit montaggio antenna 755340	\N	60.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
64cb2758-5dde-4760-8794-a39f0943178d	STIHL	Robot rasaerba	RMI422	Robot rasaerba Stihl iMOW RMI 422 800 m/q 20cm	800 m/q	700.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
7fb70acf-4dd7-4cde-8f5e-daa5bd2d2ce5	STIHL	Robot rasaerba	IMOW5	Robot rasaerba Stihl iMOW 5 1500 m/q 28cm	1500 m/q	1750.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
469f7541-dd79-4cc2-b0eb-ce46418c67d7	STIHL	Accessori robot	IMOW-TETTUCCIO	Tettuccio parasole ribaltabile iMOW	\N	180.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
3dc5db8e-73b9-43bc-8e3b-1a363c7371e2	WORX	Robot rasaerba	WR147E1	Robot Landroid WR 147E1 L 1000 m/q 18cm	1000 m/q	890.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
ed62da0a-6099-4cf1-8263-cb2b985332af	WORX	Accessori robot	KIT-RUOTE-141	Kit ruote appesantite x 141/165/167	\N	90.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
9172417e-c1b8-4946-bf08-1f4ac822d5c3	WORX	Accessori robot	KIT-RUOTE-148	Kit ruote appesantite x 148/147/155	\N	130.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
04cd2adc-26a1-478a-b19f-40040b85e203	WORX	Accessori robot	KIT-USS-ACS	Kit sensori ultrasuoni ACS Landroid	\N	240.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
47a43941-4feb-4572-aa4d-6ae33846b2d2	WORX	Accessori robot	CAPPOTTINA-LAND	Cappottina apribile Landroid	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
c85ee23c-3493-4c5c-9e5d-4995a6e65732	WORX	Accessori robot	KIT-BASE-141	Kit base ricarica x 141/167/148/167	\N	210.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
b1021e75-7b0f-4c19-93a3-5dcf83156243	WORX	Accessori robot	KIT-BASE-143	Kit base ricarica x 143/147/155	\N	230.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
55507625-96e4-4e75-bcfc-a73084ac2527	WORX	Batterie	BATT-20V-4AH-PRO	Batteria 20V 4,0Ah PRO Landroid	\N	85.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
9102b382-8457-4db4-a9e8-617bcee83a73	SEGWAY	Robot rasaerba	YARBO-RASAERBA	Yarbo + modulo rasaerba 25.000 m/q 50cm	25000 m/q	7200.00	\N	\N	\N	22.00	2026-03-12 14:07:21.344265+00	\N	\N	\N
e490d332-4ab0-446b-914a-692d4d14b227	GRILLO	Motocoltivatori	G45	Motocoltivatore G 45 contror. 50cm KH 5,5HP 1 marcia	\N	1671.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
049138dc-489e-470d-9aaf-1e88d318e188	GRILLO	Motocoltivatori	G46	Motocoltivatore G 46 contror. 50cm KH 5,5HP 1+1 marce	\N	2466.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
51bf137e-dd8f-4a54-a3be-4b9234b94fac	GRILLO	Motocoltivatori	G55	Motocoltivatore G 55 fresa 58cm R 5,0HP 2+2 marce	\N	2663.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
790d9dfd-2071-431c-98b1-30622270975b	GRILLO	Motocoltivatori	G85D-LONC-S	Motocoltivatore G 85d 58cm Loncin 300 9,3HP B 2+2 strappo	\N	3649.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
207e3768-d381-44ae-8fa7-1d296a134a51	GRILLO	Motocoltivatori	G85D-RATO-E	Motocoltivatore G 85d 58cm Rato 8,5HP B 2+2 elettrico	\N	4026.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
5ac4a9fa-57b7-484c-82ae-182b3ceb2e01	GRILLO	Motocoltivatori	G85D-L350-E	Motocoltivatore G 85d 58cm L 350cc Diesel 2+2 elettrico	\N	5590.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
2189a336-6239-4983-b13a-e6689713063f	GRILLO	Motocoltivatori	G107D-LONC-S	Motocoltivatore G 107d 58cm Loncin 300 9,3HP B 3+3 strappo	\N	3920.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
560580d2-539e-4a62-a247-96e2e4d87a52	GRILLO	Motocoltivatori	G107D-RATO-E	Motocoltivatore G 107d 68cm Rato 8,5HP B 3+3 elettrico	\N	4460.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
ceee56c0-7164-41eb-91da-08f8c8481df4	GRILLO	Motocoltivatori	G107D-L440-E	Motocoltivatore G 107d 68cm L 440cc Diesel 3+3 elettrico	\N	6500.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
9fd0549b-0f6e-46f0-985f-844de28b9882	GRILLO	Motocoltivatori	G131	Motocoltivatore G 131 68cm L 440cc Diesel 4+2 elettrico	\N	7000.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
8edfbe3a-0875-4fd7-a795-db8ca7f1ed62	GRILLO	Accessori motocoltivatori	FRESA-68-G85	Fresa controrottante registrabile G 85/107 da cm 68	\N	50.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
b0a39887-1494-4ea3-ac41-b2ca2f8de64e	GRILLO	Accessori motocoltivatori	FRESA-68-G108	Fresa controrottante registrabile G 108/110 da cm 68	\N	50.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
6ea0be0d-dc64-4390-afb0-380eaf35a7c7	GRILLO	Accessori motocoltivatori	FRESA-DOPPIA-G85	Fresa doppia rotazione G 84/85d cm 60	\N	100.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
83ee09f5-db3f-4e10-ba8f-af2fc8439ef1	GRILLO	Motocoltivatori	MAX1	Motocoltivatore MAX 1 58cm Loncin 5,5HP B 2+2 strappo	\N	2380.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
90e18323-94ab-456a-8b91-12f1eae7b93e	GRILLO	Motocoltivatori	MAX2	Motocoltivatore MAX 2 dif. 58cm GD 349cc Diesel 2+2 elettrico	\N	3950.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
94890420-e965-4d20-a0e1-40792495f20a	GRILLO	Motocoltivatori	MAX3	Motocoltivatore MAX 3 dif. 68cm GD 440cc Diesel 2+2 elettrico	\N	4350.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
1ea2b904-f562-4576-b9dd-a4987d7667b0	GRILLO	Trimmer	HWT570	Trimmer HWT 570 Multiforce 140cc spinta	\N	1205.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
43a0d4cb-fb5a-473c-b630-b8a8d87b74fe	GRILLO	Accessori trimmer	KIT-SPAZ-350	Kit spazzola mm 350 x HWT 570	\N	464.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
3cb8f18d-524b-4bc4-8576-8adff67adf63	GRILLO	Trimmer	HWT600WD	Trimmer HWT 600 WD H 160cc 1 marcia	\N	1413.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
5acba464-d17b-45b2-9ced-e9829b22a564	GRILLO	Climber	CL7.15	Climber CL 7.15 85cm L15 Idro elettrico	\N	6250.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
800e615c-1234-416f-9eb5-2ea0e428bc9b	GRILLO	Climber	CL7.18	Climber CL 7.18 85cm B18 Idro elettrico	\N	7987.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
e06ed14a-9814-4ea6-ac98-0ca8fe0709e4	GRILLO	Climber	CL9.18	Climber CL 9.18 91cm B18 Idro elettrico	\N	10860.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
2f61d1f4-3a80-4a9c-b904-a3037baf5543	GRILLO	Climber	CL9.22	Climber CL 9.22 91cm B22 Idro elettrico	\N	11985.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
ba147987-aaaa-4990-80d3-0af04d0669cd	GRILLO	Climber	CL10AWD22	Climber 10 AWD 22 B22 Idro elettrico	\N	13634.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
a148e329-e353-47a4-beda-5ad1b823f4d0	GRILLO	Climber	CL10AWD27	Climber 10 AWD 27 B27 Idro elettrico	\N	15811.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
3565a8d6-60a0-4216-a45c-83de9e73c90d	GRILLO	Climber	FD220R-L15	FD 220 R L15 Idro elettrico	\N	6021.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
0dbed7da-4861-49f6-9da9-36dc9a92fe45	GRILLO	Climber	FD220R-B16	FD 220 R B16 Idro elettrico	\N	7421.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
d14ce3a3-da7a-476d-88ce-0fdac3e85c1e	GRILLO	Climber	FD280R-B16	FD 280 R B16 Idro elettrico	\N	9466.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
468babca-e25c-4401-abb3-772c43918536	GRILLO	Climber	FD450	FD 450 113cm Lt.450 B22 Idro elettrico	\N	12610.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
6c8ff67a-b3af-4cb3-ad4e-849c08548715	GRILLO	Climber	FD500	FD 500 113cm Lt.700 K20 Idro elettrico	\N	20280.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
3f1e51dc-4e63-4460-ba2c-4cb533228b98	GRILLO	Climber	FX27	FX 27 B27 Idro elettrico	\N	11636.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
13886f11-a5df-41f7-bbd7-0fdd34ac5118	PASQUALI	Motocoltivatori	SB28-H5.5	Motocoltivatore SB 28 Powersafe 52cm Honda 5,5HP	\N	2990.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
635e65c4-0070-479e-a00e-dee3ff8043a6	PASQUALI	Motocoltivatori	SB38-H9	Motocoltivatore SB 38 Powersafe 66cm Honda 9HP	\N	3900.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
845ae13b-9d54-4bec-81d6-5e082d10be94	PASQUALI	Motocoltivatori	SB38-H9AE	Motocoltivatore SB 38 Powersafe 66cm Honda 9HP AE	\N	4350.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
b2b3ad6f-370b-4d96-94e8-9ff923c91401	PASQUALI	Motocoltivatori	SB38-H11	Motocoltivatore SB 38 Powersafe 66cm Honda 11HP	\N	4100.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
be9ea809-ea06-4648-ba0f-628b1fed2094	PASQUALI	Motocoltivatori	SB38-KD8	Motocoltivatore SB 38 Powersafe 66cm Kohler Diesel 8HP	\N	4850.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
d64173d7-3b7f-4f3d-bf22-9bfdbcf8261b	PASQUALI	Motocoltivatori	SB38-KD8AE	Motocoltivatore SB 38 Powersafe 66cm Kohler Diesel 8HP AE	\N	5200.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
cfafa167-f71f-4e43-9ee8-66cd1e6e1e8b	PASQUALI	Accessori motocoltivatori	KIT-COFANO-SB38	Kit cofano motore SB 38	\N	120.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
950c8956-1af4-44eb-bcf2-39a773a21b4f	PASQUALI	Motocoltivatori	XB40-H12	Motocoltivatore XB 40 Powersafe 80cm Honda 12HP	\N	4300.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
55de7ba6-331e-47f4-90f2-f3777fc9e436	PASQUALI	Motocoltivatori	XB40-H12AE	Motocoltivatore XB 40 Powersafe 80cm Honda 12HP AE	\N	4800.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
28d9788b-d052-4653-8332-f96d0411cd24	PASQUALI	Motocoltivatori	XB40-Y10	Motocoltivatore XB 40 Powersafe 80cm Yanmar 10HP	\N	4950.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
205c6e26-510c-4873-9d0e-bba306a4ccc7	PASQUALI	Motocoltivatori	XB40-Y10AE	Motocoltivatore XB 40 Powersafe 80cm Yanmar 10HP AE	\N	5450.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
0c27df23-fb2c-4a3e-87f2-4502382b349a	PASQUALI	Accessori motocoltivatori	KIT-COFANO-XB40	Kit cofano motore XB 40	\N	120.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
a57f9c31-bb1b-41a9-a94e-1b74cd96713c	PASQUALI	Accessori motocoltivatori	ATTACCO-RAPIDO	Attacco rapido Pasquali	\N	170.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
cad71d88-355e-4267-a6e4-a237235d4ae9	PASQUALI	Motocoltivatori	XB50-KD12AE	Motocoltivatore XB 50 Powersafe 85cm Kohler D440 12HP AE	\N	6750.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
eb6a01b1-37b9-4613-92af-0b705c0df5a4	PASQUALI	Motocoltivatori	XB80HY-H12	Motocoltivatore idrostatico XB 80 HY 80cm Honda 12HP	\N	5500.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
bab82e37-ff10-403d-b330-9ee1752122e3	PASQUALI	Motocoltivatori	XB80HY-H12AE	Motocoltivatore idrostatico XB 80 HY 80cm Honda 12HP AE	\N	6100.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
4ebb156f-8bd5-4c2e-a838-13a786b1004d	PASQUALI	Motocoltivatori	XB80HY-Y10AE	Motocoltivatore idrostatico XB 80 HY 80cm Yanmar 10HP AE	\N	6750.00	\N	\N	\N	22.00	2026-03-12 14:07:36.743139+00	\N	\N	\N
d1402f67-d269-4583-b899-00d3e44e555d	STIHL	Motoseghe	MA04-011-5800	MSA 60.0 C-B 1/4"P	\N	199.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5c19d988-ec2a-4194-b4fd-9f2e636035f4	STIHL	Motoseghe	MA04-011-5806	MSA 60.0 C-B 1/4"P SET BATTERIA/CARICA	\N	339.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
784cde8c-67a4-4c79-8f1e-7eef31d3f8da	STIHL	Motoseghe	MA04-011-5816	MSA 70.0 C-B 1/4"P	\N	239.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
8743fb88-a213-4351-98cb-968374f8b025	STIHL	Motoseghe	MA04-011-5822	MSA 70.0 C-B 1/4"P SET BATTERIA/CARICA	\N	409.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
d696df48-c4fa-4758-bb24-5867e614c8bd	STIHL	Motoseghe	MA04-011-5843	MSA 80.0 C-B 1/4"P	\N	389.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
78e08819-aa6a-4abd-984d-3ccc50ba09d8	STIHL	Motoseghe	MA04-011-5832	MSA 80.0 C-B 1/4"P SET BATTERIA/CARICA	\N	559.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
67be2e90-81f9-4b56-ba77-aed1f2ded491	STIHL	Motoseghe	MA03-200-0004	MSA 160.0 C-B Doppia impugnatura 30cm/12"	\N	350.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
406da2e9-647f-4a18-91d7-752d846c991d	STIHL	Motoseghe	1252-200-0043	MSA 161 T 25cm/10"	\N	400.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
87007a16-9b3e-4ae7-8fd7-4eac30c21ad8	STIHL	Motoseghe	1252-200-0044	MSA 161 T 30cm/12"	\N	410.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
b2f45a39-1f4c-40a6-84c1-57ddde9498a1	STIHL	Motoseghe	MA05-200-0000	MSA 190.0 T 30cm/12"	\N	350.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
a5ea0533-2788-43fe-a5a0-c8fb4bde4458	STIHL	Motoseghe	MA03-200-0010	MSA 200.0 C-B 30cm/12"	\N	430.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
ebbd5424-1e9e-4249-9a57-e76061986b0d	STIHL	Motoseghe	MA01-200-0002	MSA 220.0 TC-O Livello olio 30cm/12"	\N	770.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5bfed3f3-0bca-4cd8-8eb9-329348d7e13c	STIHL	Motoseghe	MA01-200-0003	MSA 220.0 TC-O Livello olio 35cm/14"	\N	780.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
71b022f1-3693-4dc5-97ff-07488c2b7a95	STIHL	Motoseghe	MA01-200-0021	MSA 220.0 T 30cm/12"	\N	560.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
ca7abb81-312b-4fa0-b282-39b22da8bc1a	STIHL	Motoseghe	MA01-200-0022	MSA 220.0 T 35cm/14"	\N	570.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
08abe05a-3632-478f-a587-dbff5cb7d073	STIHL	Motoseghe	MA03-200-0020	MSA 220.0 C-B 35cm/14"	\N	460.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c79717e1-ed81-4827-942a-26191b52173e	STIHL	Motoseghe	MA03-200-0021	MSA 220.0 C-B 40cm/16"	\N	470.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
8aa85b7a-f73c-4f8b-b83d-7dad6ddc0a25	STIHL	Motoseghe	MA03-200-0027	MSA 220.0 C-B Catena DURO 3 35cm/14"	\N	490.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
6cef6b80-016f-484b-80f3-4eeb74af53e0	STIHL	Motoseghe	MA02-200-0004	MSA 300.0 40cm/16"	\N	760.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
9b71f0ed-c1f8-4cd2-b019-01544f55ace0	STIHL	Motoseghe	MA02-200-0007	MSA 300.0 45cm/18"	\N	770.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
98960e29-fb96-483e-953d-a75aa0579a77	STIHL	Motoseghe	MA02-200-0082	MSA 300.1 C-O Livello olio 40cm/16"	\N	850.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
4bfad4a8-fdda-444f-a6a0-9fc834cf9586	STIHL	Motoseghe	MA02-200-0092	MSA 300.1 C-O Livello olio 45cm/18"	\N	860.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
6c540c9f-4d29-4fa0-9a87-5dc823858e0a	STIHL	Motoseghe	1208-200-0304	MSE 141 C-Q 30cm/12" 61PMM3	\N	180.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c08d4a0c-5e06-4b01-a699-eee17c63e713	STIHL	Motoseghe	1208-200-0332	MSE 141 C-Q 35cm/14" 61PMM3	\N	190.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
67fa2c57-1f05-4f58-a24b-8ab4444ab75a	STIHL	Motoseghe	1209-200-0154	MSE 170 C-Q 30cm/12" 61PMM3	\N	270.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
54713263-d206-4ab3-93e2-ae71751d3bf8	STIHL	Motoseghe	1209-200-0155	MSE 170 C-Q 35cm/14" 61PMM3	\N	280.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
000e2339-6dbd-4c82-b752-166d48c9dc47	STIHL	Motoseghe	1209-200-0157	MSE 190 C-Q 35cm/14" 63PM3	\N	320.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c218006c-8038-491d-a782-dcd082fcffb6	STIHL	Motoseghe	1209-200-0180	MSE 190 C-Q 40cm/16" 63PM3	\N	330.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
206b69e5-fc8a-40ab-b352-d9749aaeb982	STIHL	Motoseghe	1209-200-0160	MSE 210 C-BQ 35cm/14" 63PM3	\N	380.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
7b35be7c-d63a-4da0-9399-ab2137380d19	STIHL	Motoseghe	1209-200-0179	MSE 210 C-BQ 40cm/16" 63PM3	\N	390.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
43441b97-9473-4e75-84e5-1fd99159deb9	STIHL	Motoseghe	1148-200-0002	MS 162 61PMM3	\N	199.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
eee1ef3f-3efc-4220-a170-d02d39b76543	STIHL	Motoseghe	1148-200-0003	MS 162 C-BE 61PMM3	\N	240.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
36099197-731c-4118-902f-d555f1bda361	STIHL	Motoseghe	1148-200-0011	MS 172 35cm/14" 63PM3	\N	270.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
ba96b567-45ea-4b93-993e-30fcfd4aedff	STIHL	Motoseghe	1148-200-0014	MS 172 40cm/16" 63PM3	\N	280.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
83da1d1a-6303-4a7a-af99-f2b292f4b28c	STIHL	Motoseghe	1148-200-0033	MS 172 C-BE 35cm/14" 63PM3	\N	320.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
38fa7821-4d74-4ef1-9559-e2248df9d4ba	STIHL	Motoseghe	1148-200-0035	MS 172 C-BE 40cm/16" 63PM3	\N	330.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
f832aabc-fb54-48fe-9c31-75688265c271	STIHL	Motoseghe	1148-200-0064	MS 182 40cm/16" 63PM3	\N	370.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
07041881-8e1a-4243-bdf0-31514bd93d05	STIHL	Motoseghe	1148-200-0104	MS 182 C-BE 40cm/16" 63PM3	\N	420.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
9087494f-401d-4d4f-b0e4-af6a4a56c2b8	STIHL	Motoseghe	1146-200-0056	MS 151 TC-E 1/4"P 25cm	\N	420.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
8c07ff2d-ff35-446b-bd78-151e2c7b9734	STIHL	Motoseghe	1146-200-0057	MS 151 TC-E 1/4"P 30cm	\N	430.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
dd684010-ff43-4971-b2f3-88cc79f7d917	STIHL	Motoseghe	1146-200-0071	MS 151 TC-E ErgoStart 1/4"P 30cm	\N	560.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
584c1500-1f0e-4d91-9420-18698d7755e8	STIHL	Motoseghe	1146-200-0054	MS 151 C-E 1/4"P 25cm	\N	510.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c854dcf3-bae9-4894-a5dd-b4723e24e8c6	STIHL	Motoseghe	1146-200-0055	MS 151 C-E 1/4"P 30cm	\N	520.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
70a20dcb-3a00-43d8-a03e-138290013578	STIHL	Motoseghe	1146-200-0059	MS 151 C-E 1/4"P ErgoStart 30cm	\N	570.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5d067119-ae24-4389-ad06-7b5631a2de45	STIHL	Motoseghe	1137-200-0312	MS 194 T 1/4"P 35cm/14"	\N	370.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
bb8d32ee-8cc9-461e-91f2-0439fc4cbf1d	STIHL	Motoseghe	1137-200-0314	MS 194 T 1/4"P 30cm/12" 71PM3	\N	360.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
a1b730e4-f5c4-4c02-9e25-72dfa4a3cdb4	STIHL	Motoseghe	1137-200-0322	MS 194 T 3/8"P 30cm/12"	\N	360.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5adbce03-39f6-4120-a062-ab10663e3595	STIHL	Motoseghe	1137-200-0323	MS 194 T 3/8"P 35cm/14"	\N	370.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
b4ef9001-56f3-4965-ab77-ea54dc84cd72	STIHL	Motoseghe	1137-200-0324	MS 194 TC-E 3/8"P ErgoStart	\N	460.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
4d1628e7-bfe7-41ab-ba34-ed5efe428474	STIHL	Motoseghe	1137-200-0332	MS 194 C-E 30cm/12" 61PMM3	\N	450.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
57f31eb4-7942-41a2-b57f-230fabfa2a61	STIHL	Motoseghe	1137-200-0334	MS 194 C-E 1/4" ErgoStart	\N	490.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
7c5fc548-370c-42e4-98f4-3c0d9c3fc980	STIHL	Motoseghe	1137-200-0340	MS 194 T 1/4"P 30cm/12" 71PM3 ErgoStart	\N	480.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
f2ffddeb-2be2-448d-bb02-94e19fd0a38a	STIHL	Motoseghe	1137-200-0370	MS 194 TC-E 35cm/14" 61PMM3	\N	470.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c5994396-7b64-4734-9da5-92cbfe4b015c	STIHL	Motoseghe	1145-200-0263	MS 201 C-M 3/8"P Doppia impugnatura 35cm/14"	\N	890.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
ccd469c1-b001-4ccd-803b-c3f63362daed	STIHL	Motoseghe	1145-200-0264	MS 201 C-M 3/8"P Doppia impugnatura 40cm/16"	\N	900.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
0acf8ff3-aff9-451a-a177-3fc6d38a163a	STIHL	Motoseghe	1145-200-0267	MS 201 TC-M 3/8"P 35cm/14"	\N	900.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
6bd72b71-f965-4c62-b0d9-06cd5c58752e	STIHL	Motoseghe	1145-200-0270	MS 201 TC-M 3/8"P 30cm/12"	\N	890.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
9583fc05-4640-4f7b-98bd-0b33c528b836	STIHL	Motoseghe	1148-200-0139	MS 212 35cm/14" 63PM3	\N	440.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
cd894a55-8641-4655-ae90-f0852e87afda	STIHL	Motoseghe	1148-200-0144	MS 212 40cm/16" 63PM3	\N	450.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5839942b-2ba1-4426-9eb0-07f6cf6dd3f2	STIHL	Motoseghe	1148-200-0179	MS 212 C-BE 35cm/14" 63PM3	\N	480.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
834ad20f-47fd-48a5-be8f-39647b530234	STIHL	Motoseghe	1148-200-0184	MS 212 C-BE 40cm/16" 63PM3	\N	490.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
27b5cb47-7181-4549-a737-667e6f8bb37a	STIHL	Motoseghe	1143-200-0684	MS 231 40cm/16" 23RMS	\N	510.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
f16d219e-2adb-4a68-b9f8-93b81e7a3f56	STIHL	Motoseghe	1143-200-0688	MS 231 C-BE 40cm/16" 23RMS	\N	550.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
e8f2d4ca-8644-41f5-9efa-73aee102c2ea	STIHL	Motoseghe	1143-200-0721	MS 231 45cm/18" 23RMS	\N	520.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
570b7c8a-d0d1-4ed2-8b56-01be1b7f92cb	STIHL	Motoseghe	1143-200-0722	MS 231 C-BE 45cm/18" 23RMS	\N	550.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
41cb45bb-5b14-4495-8bd7-bd3578728a5d	STIHL	Motoseghe	1143-200-0683	MS 251 40cm/16" 23RMS	\N	570.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
227a415e-7cde-4a1b-96dc-dda5b07124ff	STIHL	Motoseghe	1143-200-0686	MS 251 C-BE 40cm/16" 23RMS	\N	630.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
72894bf7-0f62-4cea-90c6-d0f7b7851de5	STIHL	Motoseghe	1143-200-0719	MS 251 45cm/18" 23RMS	\N	580.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
17a12215-89cc-47de-9bb8-dafaa0832e13	STIHL	Motoseghe	1143-200-0720	MS 251 C-BE 45cm/18" 23RMS	\N	640.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
bd8e8084-de32-476a-932a-6ed732f605d6	STIHL	Motoseghe	1141-200-0647	MS 261 C-M 40cm/16"	\N	1000.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c6c5ba7f-49a2-4d9e-a3e5-c2bdf25ca698	STIHL	Motoseghe	1141-200-0649	MS 261 C-BM 40cm/16"	\N	1030.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
d284786b-47e7-43b6-b642-7ab2813c0a3b	STIHL	Motoseghe	1141-200-0651	MS 261 C-M VW 40cm/16"	\N	1100.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
8d4faee1-d50b-40a7-b68a-06e6a53dbe84	STIHL	Motoseghe	1141-200-0652	MS 261 C-M 45cm/18"	\N	990.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
7b89b8c7-22c4-48dd-9ffd-f5dd5c2b2511	STIHL	Motoseghe	1141-200-0665	MS 261 C-BM 45cm/18"	\N	1040.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
4daf7a5a-abe2-4348-9fdd-ae6e3b424ac8	STIHL	Motoseghe	1141-200-0645	MS 271 40cm/16"	\N	690.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c6ce4e42-e4f5-4ba7-b3ba-17228088c59e	STIHL	Motoseghe	1141-200-0660	MS 271 45cm/18"	\N	700.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
717f5ec5-2e0d-4f12-b18d-3b8451806926	STIHL	Motoseghe	1141-200-0687	MS 291 40cm/16" 36RM	\N	740.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
5f7c860a-f923-431b-8dd4-f7e223184c58	STIHL	Motoseghe	1141-200-0690	MS 291 45cm/18" 36RM	\N	750.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
1bd57e8d-f53d-405d-9fe3-4618b3115490	STIHL	Motoseghe	1140-200-0777	MS 311 50cm/20" 36RM	\N	850.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
f6ba46a0-928b-473b-9fc0-68385fd15130	STIHL	Motoseghe	1140-200-0741	MS 391 50cm/20" 36RM	\N	910.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
289ab526-aeeb-4335-a6df-445a35c997dd	STIHL	Motoseghe	MB01-200-0008	MS 400.1 C-M 50cm/20" 36RS	\N	1360.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
ac139512-072c-46eb-9e0b-467db70e5be1	STIHL	Motoseghe	1142-200-0032	MS 462 C-M 50cm/20" 36RS3	\N	1400.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
44c94cff-94a6-40c2-a826-ac8399e7b8dc	STIHL	Motoseghe	1142-200-0033	MS 462 C-M 63cm/25" 36RS3	\N	1430.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
4fb27da2-5dff-4093-aa5d-777140de66a9	STIHL	Motoseghe	1147-200-0000	MS 500i 3/8"R 50cm/20" 36RS	\N	1700.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
91f5a8dd-65e5-448e-9a70-aca5aa9bb8c2	STIHL	Motoseghe	1147-200-0001	MS 500i 3/8"R 63cm/25" 36RS	\N	1720.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
1cfdee12-250e-4c0d-8ffd-bbf30c9cc772	STIHL	Motoseghe	1144-200-0319	MS 661 C-M 71cm/28" 36RS	\N	1630.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
2de24e24-a5fc-4e0a-ae8e-14d1f8532801	STIHL	Motoseghe	1144-200-0322	MS 661 C-M 63cm/25" 36RS	\N	1600.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
75d9cad5-4bcc-4ba4-b0fd-4f449ca6a89e	STIHL	Motoseghe	1124-200-0204	MS 881 90cm/36" 46RS	\N	1990.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
a3eb8d62-1fd7-4514-a644-1a5d3e108ebc	STIHL	Motoseghe	1124-200-0206	MS 881 105cm/41" 46RS	\N	2020.00	\N	\N	\N	22.00	2026-03-12 14:37:31.649478+00	\N	\N	\N
c7e6e274-3e3c-454f-b7fd-53459889b3ea	NEGRI	Biotrituratori	R70B-B&S	Biotrituratore R70 B motore B&S 550e 140cc lame	\N	790.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
12c0760a-86f6-4c50-8f87-87813d3fc831	NEGRI	Biotrituratori	R70B-H	Biotrituratore R70 B motore Honda GCV 160cc lame	\N	890.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
8444c3fd-a528-4150-a448-aab6172cbbac	NEGRI	Biotrituratori	R70D-B&S	Biotrituratore R70 D motore B&S 550e 140cc dischi	\N	790.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
3b179d1a-c1a8-4cd9-9717-0e0cd94becee	NEGRI	Biotrituratori	R70D-H	Biotrituratore R70 D motore Honda GCV 160cc dischi	\N	890.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
0ed80835-c9f0-4778-ac65-99e8dceab5d3	NEGRI	Biotrituratori	R95B-H	Biotrituratore R95 B motore Honda GX 160cc lame	\N	1150.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
97033540-18a2-45c4-b502-318be7fcdd09	NEGRI	Biotrituratori	R95D-H	Biotrituratore R95 D motore Honda GX 160cc dischi	\N	1150.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
875f84fb-5fb1-40e7-9b36-1c3d35fadebe	NEGRI	Biotrituratori	R95B-H200	Biotrituratore R95 B motore Honda GX 200cc lame	\N	1250.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
e69a548a-cb37-4c5a-a5f5-12a9d035f017	NEGRI	Biotrituratori	R95D-H200	Biotrituratore R95 D motore Honda GX 200cc dischi	\N	1250.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
8170dfac-389d-469d-928c-94132bd696ae	NEGRI	Biotrituratori	R185B-H270	Biotrituratore R185 B motore Honda GX 270cc lame	\N	2100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
522dc11a-ba69-4fe4-a092-0a943d615f13	NEGRI	Biotrituratori	R185D-H270	Biotrituratore R185 D motore Honda GX 270cc dischi	\N	2100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
db79dc5a-8f53-4689-9d19-67b995215d33	NEGRI	Biotrituratori	R185B-H390	Biotrituratore R185 B motore Honda GX 390cc lame	\N	2350.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
ac5860a8-d8c4-4251-9765-6288e3c0b5b9	NEGRI	Biotrituratori	R185D-H390	Biotrituratore R185 D motore Honda GX 390cc dischi	\N	2350.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
183a2ea7-70ba-45d4-8204-b295f4186a3a	NEGRI	Biotrituratori	R225B-H390	Biotrituratore R225 B motore Honda GX 390cc lame	\N	3100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
ced3dbae-2279-4ff5-8861-06ce2ea4518a	NEGRI	Biotrituratori	R225D-H390	Biotrituratore R225 D motore Honda GX 390cc dischi	\N	3100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
a122c83e-aef6-44be-b8ef-ef59f7eaa609	NEGRI	Biotrituratori	R225B-K	Biotrituratore R225 B motore Kawasaki 400cc lame	\N	3400.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
a0da3a1e-f393-4d74-9983-170e04c63b66	NEGRI	Biotrituratori	R225D-K	Biotrituratore R225 D motore Kawasaki 400cc dischi	\N	3400.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
7f05545a-8220-4673-98d0-e4cb8b36bbc1	NEGRI	Biotrituratori	R70E-2200	Biotrituratore R70 E elettrico 2200W lame	\N	490.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
5876a1a7-1d76-4040-ae4b-5935a76736de	NEGRI	Biotrituratori	R95E-2800	Biotrituratore R95 E elettrico 2800W lame	\N	750.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
7d79dc5f-bf14-4f3c-a72d-ec22068ca968	NEGRI	Biotrituratori	R95E-3000D	Biotrituratore R95 E elettrico 3000W dischi	\N	800.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
943af521-d6e0-466a-a85d-f2fd0201d743	TORO	Zero Turning	75742	TimeCutter 42" 452cc 107cm	\N	2700.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
ba5edd3c-674a-4354-b73c-f412cafe1c1c	TORO	Zero Turning	75750	TimeCutter 50" 452cc 127cm	\N	3100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
eead992f-fb8d-4d59-a5d9-7afe55268074	TORO	Zero Turning	75760	TimeCutter 60" 452cc 152cm	\N	3500.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
09cfa663-1391-49e2-a95d-b19f8f4cc3e1	TORO	Zero Turning	74959	MyRide 48" Kawasaki 726cc 122cm	\N	5200.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
9da0cb56-9ddd-4112-a1f4-d2f742348892	TORO	Zero Turning	74960	MyRide 54" Kawasaki 726cc 137cm	\N	5600.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
1ad5ca61-efa2-4bfb-a3fa-fcfc75d4b623	TORO	Zero Turning	74961	MyRide 60" Kawasaki 726cc 152cm	\N	6200.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
7522696f-b716-4bd8-bf87-eb5b99ba5183	TORO	Rasaerba	20340	Recycler 21" 140cc spinta 53cm	\N	380.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
20759eba-bd38-4515-bb71-e78f968da6df	TORO	Rasaerba	20332	Recycler 21" 140cc 1vel. 53cm	\N	430.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
dbb1a9f4-bab4-4c28-aa1f-19c41c5924c3	TORO	Rasaerba	20333	Recycler 21" 140cc Varia 53cm	\N	520.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
b259888c-42af-48e5-a868-e7a402eb48b6	TORO	Rasaerba	21357	Recycler 21" 60V Flex-Force spinta 53cm	\N	480.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
4c8bf89d-d9ce-49e9-919a-9045a9989633	TORO	Rasaerba	21358	Recycler 21" 60V Flex-Force Varia 53cm	\N	580.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
f11cf483-ff50-46c9-89be-46d5837fa49d	TORO	Decespugliatori	51836	Decespugliatore 60V Flex-Force 38cm	\N	210.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
e0db7160-1948-44bc-a4b6-f1cd0acbae54	TORO	Soffiatori	51821	Soffiatore 60V Flex-Force	\N	180.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
44d7a8de-472f-484b-837b-a73a71b0c70e	TORO	Batterie	88650	Batteria 2,5Ah 60V Flex-Force	\N	80.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
70c84418-2a55-4e20-9687-c795637bbae8	TORO	Batterie	88675	Batteria 7,5Ah 60V Flex-Force	\N	180.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
d5166f48-e34e-4152-abfb-8cbd3535a2f2	TORO	Batterie	88690	Caricabatterie standard 60V	\N	60.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
2feff61f-fc46-4013-9334-3b7772d49095	BI-VI	Motopompe	BV-MP25-H	Motopompa acque chiare 25mm Honda GX 50cc	\N	480.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
1d8609dc-b6b4-44e8-9da4-9b0e08744251	BI-VI	Motopompe	BV-MP40-H	Motopompa acque chiare 40mm Honda GX 120cc	\N	620.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
085763b1-7d55-4782-9e22-c466867cd7ac	BI-VI	Motopompe	BV-MP50-H	Motopompa acque chiare 50mm Honda GX 160cc	\N	750.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
ad6de56a-ce35-476a-b1b9-accbd82c9719	BI-VI	Motopompe	BV-MP80-H	Motopompa acque chiare 80mm Honda GX 200cc	\N	950.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
8a0fdbf6-51ca-4c88-9fae-4b1b08e49950	BI-VI	Motopompe	BV-MPS50-H	Motopompa acque sporche 50mm Honda GX 160cc	\N	920.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
29f55418-83df-4ee2-9c7f-2cbe75b975c0	BI-VI	Motopompe	BV-MPS80-H	Motopompa acque sporche 80mm Honda GX 200cc	\N	1150.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
5ed175d9-c2ab-488d-88c0-498745e50469	BI-VI	Motopompe	BV-EP25	Elettropompa 25mm 0,5HP	\N	180.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
2ff721e1-e5ae-4a34-9d05-7baac77961b2	BI-VI	Motopompe	BV-EP40	Elettropompa 40mm 1HP	\N	250.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
9502bbdb-5707-4cda-bb74-45a51fca6bba	BI-VI	Motopompe	BV-EP50	Elettropompa 50mm 2HP	\N	380.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
feebbbd5-034c-45bf-91d1-360152fd38e1	BI-VI	Irrorazione	BV-CI100-H	Carrello irrorazione 100L motore Honda GX 120cc	\N	1200.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
a584a8d2-d50a-404a-9921-cb530e98789e	BI-VI	Irrorazione	BV-CI200-H	Carrello irrorazione 200L motore Honda GX 160cc	\N	1600.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
a72d7e75-1f78-4cd9-bad0-45bd864f2181	BI-VI	Irrorazione	BV-CI300-H	Carrello irrorazione 300L motore Honda GX 200cc	\N	2100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
a9685d46-d3f3-4bfc-8410-4acd9c4985db	BI-VI	Irrorazione	BV-CI400-H	Carrello irrorazione 400L motore Honda GX 270cc	\N	2700.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
783d2017-2a71-4b71-9f53-b8f3d133f1fa	BI-VI	Irrorazione	BV-CIE100	Carrello irrorazione 100L elettrico 220V	\N	850.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
0bda6182-2b6d-48d1-93f3-8bd9a104e2bc	BI-VI	Irrorazione	BV-CIE200	Carrello irrorazione 200L elettrico 220V	\N	1100.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
c3578bbd-8c2d-48be-b70c-c73355e6e60f	BI-VI	Irrorazione	BV-BI600-H	Botte irrorazione 600L Honda GX 200cc	\N	3200.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
55403240-f75f-4eaf-a686-700685b05554	BI-VI	Irrorazione	BV-BI800-H	Botte irrorazione 800L Honda GX 270cc	\N	3900.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
042713e8-4e3f-471b-ba2e-ed81d1d5f46b	BI-VI	Irrorazione	BV-BI1000-H	Botte irrorazione 1000L Honda GX 390cc	\N	4600.00	\N	\N	\N	22.00	2026-03-12 15:41:57.961398+00	\N	\N	\N
0a638aa5-65ea-41b5-a83a-5b35457d82ca	VOLPI	Potatori	V8015	Forbice potatura batteria V8015 30mm 2Ah	\N	380.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
9c762aac-6e5c-4577-9cd0-3ed90a473c42	VOLPI	Potatori	V8016	Forbice potatura batteria V8016 32mm 2,5Ah	\N	430.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
9c6a654d-0262-4e1c-a017-799bbe144b58	VOLPI	Potatori	V8025	Forbice potatura batteria V8025 35mm 2Ah	\N	480.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
1c999c64-0fc4-4381-bae3-027051fe0e6c	VOLPI	Potatori	V8030	Forbice potatura batteria V8030 40mm 2,5Ah	\N	550.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
ec277643-7cde-499b-832c-6ea1afd2e3e9	VOLPI	Potatori	V8045	Forbice potatura batteria V8045 45mm 2,5Ah	\N	650.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
3d2d83cb-4724-4822-8ff7-ee2c85d09eb6	VOLPI	Potatori	VPX30	Potatore ad asta VPX30 batteria 30mm	\N	750.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
3e647c7c-4625-4497-8a7a-34683d17a21b	VOLPI	Batterie	BATT-V8-2AH	Batteria 2Ah Volpi serie V8	\N	90.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
e95cc225-a77e-4408-a47b-b0402ffdcd4e	VOLPI	Batterie	BATT-V8-25AH	Batteria 2,5Ah Volpi serie V8	\N	110.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
c96d31b8-b3aa-4918-ad84-8d4f8e39d01d	VOLPI	Batterie	CARICA-V8	Caricabatterie Volpi serie V8	\N	55.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
753d01ec-9284-4b40-88d2-45a38aea80e4	ARCHMAN	Svettatoi	AM-SV30	Svettatoio Archman 30cc 30cm asta 2,5m	\N	890.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
85e33238-2771-4574-9ad3-c23452299f73	ARCHMAN	Svettatoi	AM-SV43	Svettatoio Archman 43cc 25cm asta 3m	\N	1050.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
e8fb42fc-4a0a-4a88-85af-af803a6642cb	ARCHMAN	Svettatoi	AM-SV43L	Svettatoio Archman 43cc 30cm asta 3,5m	\N	1150.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
be4b68bc-8cd2-4bb7-b11e-482d8666efd4	ARCHMAN	Svettatoi	AM-SVTS	Svettatoio telescopico Archman 43cc 25cm asta 2-3,5m	\N	1250.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
d1c29dcf-b964-491b-ab7b-a68ecb65f631	BLUE BIRD	Carrier	BB-CARRY250-H	Carrier/Dumper BB 250kg Honda GX 160cc	\N	2800.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
23210498-b6b9-4a8e-988c-be3bb8ac6aa5	BLUE BIRD	Carrier	BB-CARRY350-H	Carrier/Dumper BB 350kg Honda GX 200cc	\N	3400.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
bef26db4-180a-45e5-8e96-cfa10aed098a	BLUE BIRD	Carrier	BB-CARRY500-H	Carrier/Dumper BB 500kg Honda GX 270cc	\N	4200.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
543341b4-6107-41ff-af17-a912664342dc	BLUE BIRD	Carrier	BB-CARRY500-4WD	Carrier/Dumper BB 500kg 4WD Honda GX 390cc	\N	5500.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
5b6baae1-9783-438a-8038-ed3139ad821d	BLUE BIRD	Carrier	BB-CARRY750-H	Carrier/Dumper BB 750kg Honda GX 390cc	\N	5800.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
22d0315f-3115-4422-a759-6489bab4d4fc	BLUE BIRD	Trivelle	BB-TR150-H	Trivella 1 operatore Honda GX 50cc punta 150mm	\N	680.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
9c3f373c-5687-4b3d-bddd-7db18f8c4ea1	BLUE BIRD	Trivelle	BB-TR200-H	Trivella 1 operatore Honda GX 120cc punta 200mm	\N	850.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
0b119e7a-c202-4587-9980-81bc8d06ea26	BLUE BIRD	Trivelle	BB-TR200-2OP	Trivella 2 operatori Honda GX 160cc punta 200mm	\N	1100.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
23bea31d-deaa-4506-bab0-78430553cf90	BLUE BIRD	Trivelle	BB-TR300-2OP	Trivella 2 operatori Honda GX 200cc punta 300mm	\N	1400.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
39c5aa29-2816-4437-9859-e21053634c70	BLUE BIRD	Accessori trivelle	BB-PUNTA-100	Punta trivella 100mm	\N	60.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
0f8389d4-863f-4407-ba17-2cb0e8deb75e	BLUE BIRD	Accessori trivelle	BB-PUNTA-150	Punta trivella 150mm	\N	70.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
571ad551-8094-41e6-a045-05006ef152df	BLUE BIRD	Accessori trivelle	BB-PUNTA-200	Punta trivella 200mm	\N	85.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
3b879657-0718-418d-9c46-4ea31ad6ef23	BLUE BIRD	Accessori trivelle	BB-PUNTA-300	Punta trivella 300mm	\N	110.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
9d77350b-d7f8-44d0-b645-e9cd30e2e395	BLUE BIRD	Accessori trivelle	BB-PROLUNGA-1M	Prolunga trivella 1m	\N	75.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
e5f3ac83-c9fe-4ef6-822e-1b4b993d7d1b	WORTEX	Atomizzatori	WX-AT16-H	Atomizzatore a zaino 16L Honda GX 25cc	\N	620.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
43d650b3-1313-4d81-aeae-0ee04952662e	WORTEX	Atomizzatori	WX-AT20-H	Atomizzatore a zaino 20L Honda GX 35cc	\N	720.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
c7b0a4d7-f88f-4bc6-ae5b-261d5d05abe1	WORTEX	Atomizzatori	WX-AT16-E	Atomizzatore elettrico a zaino 16L batteria	\N	350.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
d5f2f06e-ff86-43de-abbb-22906df2a936	WORTEX	Atomizzatori	WX-AT20-E	Atomizzatore elettrico a zaino 20L batteria	\N	420.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
b167ddf6-42b2-43c7-ac66-66d3d1f60fd0	WORTEX	Atomizzatori	WX-AT600-H	Atomizzatore su ruote 600L Honda GX 390cc 4WD	\N	3800.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
24440be6-d674-4f93-b974-ea8875ca592d	WORTEX	Spandiconcime	WX-SC12	Spandiconcime manuale a spalla 12L	\N	45.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
459dcf7a-e221-4ab0-85e1-e6fc5b1b5c86	WORTEX	Spandiconcime	WX-SC15	Spandiconcime elettrico a spalla 15L batteria	\N	120.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
73967cfd-dbaf-4cc9-972a-591fca8bacd7	WORTEX	Spandiconcime	WX-SC80-2R	Spandiconcime trainabile 80L 2 ruote	\N	380.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
ce324ce5-a8ef-4b98-b058-77cf65f60d10	WORTEX	Spandiconcime	WX-SC100-4R	Spandiconcime trainabile 100L 4 ruote	\N	480.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
39df8d35-32ff-476c-b7c2-3018fb38a3de	WORTEX	Spandiconcime	WX-SC200	Spandiconcime trainabile 200L con cardano	\N	850.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
725b005b-14de-43ff-9421-4858c4e0b9ee	WORTEX	Compressori	WX-CP6-1500	Compressore 6L 1500W 8bar	\N	120.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
cc85c183-4b31-43f4-9529-9cf00dcd30f9	WORTEX	Compressori	WX-CP24-2000	Compressore 24L 2000W 8bar	\N	200.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
56f779ef-a9ad-4cc9-bb56-fa430d50ef54	WORTEX	Compressori	WX-CP50-3000	Compressore 50L 3000W 10bar	\N	350.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
6148cd1e-9de9-426d-9fb5-061fe93f202c	WORTEX	Compressori	WX-CP100-3000	Compressore 100L 3000W 10bar	\N	520.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
eb8e6ae8-437f-4d3b-bdc6-4d0404dc54a7	WORTEX	Compressori	WX-CP200-K	Compressore 200L motore Kohler 6HP 10bar	\N	1200.00	\N	\N	\N	22.00	2026-03-12 15:42:10.192384+00	\N	\N	\N
269af647-0c90-458f-831a-c2f4a76cfe22	STIHL	Olii	0781-516-1004	Olio catena StihlOil Plus 1L	1L	8.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
8d59791c-6767-44c0-98ef-69ce1f95d5f3	STIHL	Olii	0781-516-4004	Olio catena StihlOil Plus 4L	4L	28.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
4018360d-be2c-4d12-9876-18756bf356f2	STIHL	Olii	0781-319-8012	Olio motore HP Ultra 1L miscela 2T	1L	13.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
d5af5bb6-728a-458a-8f09-3b4f2cfd0d26	STIHL	Olii	0781-319-8013	Olio motore HP Ultra 100ml miscela 2T	100ml	3.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
5050808f-c1d8-4165-b1fe-655a4b12d17c	STIHL	Olii	0781-319-8012-4	Olio motore HP Ultra 4L miscela 2T	4L	48.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
0d6aafa8-b44c-47d9-8ed9-b5b5066c9978	STIHL	Olii	0781-120-1109	Olio motore 4T SAE 30 1L	1L	7.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
96769c7b-b674-4628-a266-099c255ff2c6	ECHO	Olii	EC-OIL-2T-100	Olio miscela Echo 2T 100ml	100ml	3.20	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
e9d0ee95-afea-4012-a62a-1ae7dff8f5e5	ECHO	Olii	EC-OIL-2T-1L	Olio miscela Echo Power Blend 2T 1L	1L	12.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
9061127f-5167-4f46-91a8-548a222888fb	ECHO	Olii	EC-OIL-2T-5L	Olio miscela Echo Power Blend 2T 5L	5L	52.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
1b88c953-dd2f-48de-8914-81b876847ca3	ECHO	Olii	EC-OIL-4T-1L	Olio motore Echo 4T SAE 30 1L	1L	8.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
da40a78a-d6bb-4761-9a44-4c27eabe923f	BRIGGS	Olii	100005E	Olio motore B&S SAE 30 600ml	600ml	7.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
90a246b1-bc3e-4a81-8830-a0770ab7b36f	BRIGGS	Olii	100028E	Olio motore B&S SAE 30 5L	5L	38.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
0006ebef-5ad3-4984-86bf-54ce5f250e9f	BRIGGS	Olii	100005E-10W30	Olio motore B&S 10W-30 600ml	600ml	7.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
af71dd55-000d-455b-bb32-c4bc29b54321	BRIGGS	Olii	100006E	Olio motore B&S Platinum 4T 5L	5L	42.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
39009193-dcfd-4a51-abdb-11ee91411d2d	CASTROL	Olii	CAST-2T-1L	Olio 2T Castrol Power1 Racing 1L	1L	14.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
40d2b2f0-d51a-42ee-b7a8-77799904beca	CASTROL	Olii	CAST-4T-1L	Olio 4T Castrol Power1 10W-40 1L	1L	12.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
d7bc69b3-a038-4723-a5fe-c2a91f46faf8	CASTROL	Olii	CAST-4T-4L	Olio 4T Castrol Power1 10W-40 4L	4L	40.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
f4cc2ba5-ced0-4a88-81a4-3efe18190d4e	TECNOGARDEN	Olii	TG-2T-1L	Olio miscela 2T Tecnogarden 1L	1L	9.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
f6636270-e217-4012-9c8b-23b3e20857b3	TECNOGARDEN	Olii	TG-2T-5L	Olio miscela 2T Tecnogarden 5L	5L	38.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
211e8230-aa95-4f16-aca9-01db4035a784	TECNOGARDEN	Olii	TG-4T-1L	Olio motore 4T SAE 30 Tecnogarden 1L	1L	7.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
3d8cbed3-49d2-4633-b72a-48c80456292a	TECNOGARDEN	Olii	TG-4T-5L	Olio motore 4T SAE 30 Tecnogarden 5L	5L	28.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
638df77c-6e98-45c8-a8ad-39e5342c55ef	TECNOGARDEN	Olii	TG-CATENA-1L	Olio catena Tecnogarden 1L	1L	6.50	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
effad0a3-aaec-4bb3-b74a-2864516f0e0b	TECNOGARDEN	Olii	TG-CATENA-5L	Olio catena Tecnogarden 5L	5L	24.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
d7976be3-f6d8-4af4-a9e6-306d28f14a50	FOREST	Spaccalegna	L7TON-H	Spaccalegna orizzontale 7T Honda GX 120cc	\N	1100.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
3072e7fa-e333-4ea4-81d6-6350f770fe6c	FOREST	Spaccalegna	L10TON-H	Spaccalegna orizzontale 10T Honda GX 160cc	\N	1400.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
a2772f87-329f-4060-a1e2-643a6f131c16	FOREST	Spaccalegna	LV16TON-H	Spaccalegna verticale/orizzontale 16T Honda GX 270cc	\N	2200.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
7a40843a-3828-4730-9dd9-1062c5bf8946	FOREST	Spaccalegna	LV22TON-H	Spaccalegna verticale/orizzontale 22T Honda GX 390cc	\N	2900.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
5e2db7f9-f908-4c63-9258-ea7f8181f3a9	FOREST	Spaccalegna	LV30TON-H	Spaccalegna verticale/orizzontale 30T Honda GX 690cc	\N	4200.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
8cfb4dcf-e3f2-4247-a791-6a423da64536	FOREST	Spaccalegna	LE7TON	Spaccalegna orizzontale 7T elettrico 2200W	\N	850.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
9da4265d-755c-4020-a69f-8f01783bfc63	FOREST	Spaccalegna	LE10TON	Spaccalegna orizzontale 10T elettrico 3000W	\N	1100.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
2f120667-5c93-4a2b-9a05-4b3e316f97f3	BLUE BIRD	Spaccalegna	BB-SP7-E	Spaccalegna 7T Blue Bird elettrico 2200W	\N	800.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
358fa1e9-6077-4cb2-8dd5-12701c99d3b7	BLUE BIRD	Spaccalegna	BB-SP10-H	Spaccalegna 10T Blue Bird Honda GX 160cc	\N	1350.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
234fa706-20ed-43f8-9cb2-681a107ab6a0	BLUE BIRD	Spaccalegna	BB-SP16-H	Spaccalegna 16T Blue Bird Honda GX 270cc V/O	\N	2100.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
a69db3d8-17ff-4c58-996b-068e80624db3	BLUE BIRD	Spaccalegna	BB-SP22-H	Spaccalegna 22T Blue Bird Honda GX 390cc V/O	\N	2800.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
ba2936d8-5a8b-49cd-9a98-cd0ea4e7a0a9	CARRIOLE	Carriole	CAR-55L	Carriola acciaio 55L ruota PVC	\N	55.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
23eccbdf-7494-484c-9b00-8d1de4b44c94	CARRIOLE	Carriole	CAR-65L	Carriola acciaio 65L ruota PVC	\N	65.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
c0e8715e-1460-4ec3-9fb0-c53011d2ae12	CARRIOLE	Carriole	CAR-80L	Carriola acciaio 80L ruota gonfiabile	\N	80.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
972f17d0-3517-481b-af6e-bf710e27aba3	CARRIOLE	Carriole	CAR-100L	Carriola acciaio 100L ruota gonfiabile	\N	95.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
fa109c38-37b4-4a29-a060-f5447cc5ffd8	CARRIOLE	Carriole	CAR-POLY-65	Carriola polietilene 65L ruota gonfiabile	\N	90.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
d2a66a93-6c75-43d4-8812-f8692e0a3766	E-POWERBARROW	Carriole	EPB-BASIC	E-PowerBarrow Basic 80L 250W batteria	\N	480.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
b30c9ecc-d972-49dc-94a8-f184c91b21ae	E-POWERBARROW	Carriole	EPB-PRO	E-PowerBarrow Pro 100L 350W batteria	\N	650.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
4e97c8ac-c9be-466a-8c53-6e50e52f7de9	E-POWERBARROW	Carriole	EPB-4WD	E-PowerBarrow 4WD 100L 500W batteria	\N	950.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
66666181-cda3-4cfe-bb39-d5e616eedd2c	F&S	Carriole	FS-CAR-70	Carriola F&S 70L acciaio rinforzato	\N	75.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
ba4164df-121d-41ca-9c29-2db8cdbbf3d9	F&S	Carriole	FS-CAR-85	Carriola F&S 85L acciaio rinforzato ruota larga	\N	95.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
1c429322-0261-4bd3-863c-3c4027a25a44	TURBO-TURF	Idrosemina	TT-HS-50	Idroseminatrice Turbo-Turf HS-50 190L Honda GX 160cc	\N	3200.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
d359fff9-5daa-48c5-9be0-fc3de19268cc	TURBO-TURF	Idrosemina	TT-HS-100	Idroseminatrice Turbo-Turf HS-100 380L Honda GX 200cc	\N	4800.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
4f5bbfe2-14e4-4cd8-a3eb-7c2bd3d910d4	TURBO-TURF	Idrosemina	TT-HS-100T	Idroseminatrice Turbo-Turf HS-100T 380L trainabile Honda	\N	5500.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
ddc818db-fd26-4cdb-82e7-e58241aa9f5e	TURBO-TURF	Idrosemina	TT-HS-200T	Idroseminatrice Turbo-Turf HS-200T 760L trainabile Honda	\N	7800.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
b1244952-5c16-4c78-8e16-a100e49df445	TURBO-TURF	Materiali idrosemina	TT-FIBER-20	Fibra cellulosica Turbo-Turf 20kg	20kg	85.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
33d50404-63d0-4e17-b686-c856ff7bfd47	TURBO-TURF	Materiali idrosemina	TT-FIBER-50	Fibra cellulosica Turbo-Turf 50kg sacco	50kg	190.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
693a5744-1fd0-48b1-b7ae-db5742e8913d	TURBO-TURF	Materiali idrosemina	TT-COLLANTE-5	Collante idrosemina 5kg	5kg	45.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
56bd3525-13c0-4c19-9d5d-f558f6d1ee23	TURBO-TURF	Materiali idrosemina	TT-COLLANTE-25	Collante idrosemina 25kg	25kg	180.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
bc47efe6-9735-4515-9502-d41eb9172cc0	TURBO-TURF	Materiali idrosemina	TT-COLORANTE	Colorante verde idrosemina 1kg	1kg	18.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
f97c327b-7aca-40a1-8873-a166a7889798	TURBO-TURF	Materiali idrosemina	TT-KIT-BASE	Kit base idrosemina (fibra 20kg + collante 5kg + colorante)	\N	140.00	\N	\N	\N	22.00	2026-03-12 15:42:21.900024+00	\N	\N	\N
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
-- Data for Name: noleggio_abbonamenti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.noleggio_abbonamenti (id, cliente_nome, cliente_tel, tipo, credito_residuo, data_inizio, data_scadenza, note, created_at) FROM stdin;
\.


--
-- Data for Name: noleggio_listini; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.noleggio_listini (id, macchina_id, fascia, tipo_listino, prezzo_iva, prezzo_netto) FROM stdin;
536	124	uno_giorno	std	227.00	186.07
537	124	due_tre_giorni	std	204.00	167.22
538	124	quattro_sette_giorni	std	184.00	150.82
539	124	oltre_sette_giorni	std	166.00	136.07
540	125	uno_giorno	std	227.00	186.07
541	125	due_tre_giorni	std	204.00	167.22
542	125	quattro_sette_giorni	std	184.00	150.82
543	125	oltre_sette_giorni	std	166.00	136.07
544	126	uno_giorno	std	466.00	381.97
545	126	due_tre_giorni	std	420.00	344.27
546	126	quattro_sette_giorni	std	379.00	310.66
547	126	oltre_sette_giorni	std	341.00	279.51
548	127	uno_giorno	std	142.00	116.40
549	127	due_tre_giorni	std	128.00	104.92
550	127	quattro_sette_giorni	std	115.00	94.27
551	127	oltre_sette_giorni	std	104.00	85.25
552	128	uno_giorno	std	199.00	163.12
553	128	due_tre_giorni	std	179.00	146.72
554	128	quattro_sette_giorni	std	161.00	131.97
555	128	oltre_sette_giorni	std	145.00	118.85
556	129	uno_giorno	std	199.00	163.12
557	129	due_tre_giorni	std	179.00	146.72
558	129	quattro_sette_giorni	std	161.00	131.97
559	129	oltre_sette_giorni	std	145.00	118.85
560	130	uno_giorno	std	466.00	381.97
561	130	due_tre_giorni	std	420.00	344.27
562	130	quattro_sette_giorni	std	378.00	309.84
563	130	oltre_sette_giorni	std	340.00	278.69
564	131	uno_giorno	std	142.00	116.40
565	131	due_tre_giorni	std	128.00	104.92
566	131	quattro_sette_giorni	std	115.00	94.27
567	131	oltre_sette_giorni	std	104.00	85.25
568	132	uno_giorno	std	142.00	116.40
569	132	due_tre_giorni	std	128.00	104.92
570	132	quattro_sette_giorni	std	115.00	94.27
571	132	oltre_sette_giorni	std	104.00	85.25
572	133	uno_giorno	std	107.00	\N
573	133	due_tre_giorni	std	96.00	\N
574	133	quattro_sette_giorni	std	86.00	\N
575	133	oltre_sette_giorni	std	77.00	\N
576	134	mezzo_giorno	std	75.00	61.48
577	134	uno_giorno	std	107.00	87.71
578	134	due_tre_giorni	std	96.00	78.69
579	134	quattro_sette_giorni	std	86.00	70.49
580	134	oltre_sette_giorni	std	77.00	63.12
581	135	mezzo_giorno	std	33.60	\N
582	135	uno_giorno	std	48.00	\N
583	135	due_tre_giorni	std	43.00	\N
584	135	quattro_sette_giorni	std	39.00	\N
585	135	oltre_sette_giorni	std	35.00	\N
586	136	mezzo_giorno	std	49.70	40.74
587	136	uno_giorno	std	71.00	58.20
588	136	due_tre_giorni	std	64.00	52.46
589	136	quattro_sette_giorni	std	58.00	47.55
590	136	oltre_sette_giorni	std	52.00	42.63
591	137	mezzo_giorno	std	49.70	\N
592	137	uno_giorno	std	71.00	\N
593	137	due_tre_giorni	std	64.00	\N
594	137	quattro_sette_giorni	std	58.00	\N
595	137	oltre_sette_giorni	std	52.00	\N
596	138	mezzo_giorno	std	152.00	\N
597	138	uno_giorno	std	217.00	\N
598	138	due_tre_giorni	std	195.00	\N
599	138	quattro_sette_giorni	std	176.00	\N
600	138	oltre_sette_giorni	std	158.00	\N
601	139	uno_giorno	std	217.00	177.87
602	139	due_tre_giorni	std	195.00	159.84
603	139	quattro_sette_giorni	std	176.00	144.27
604	139	oltre_sette_giorni	std	158.00	129.51
605	140	mezzo_giorno	std	105.00	86.07
606	140	uno_giorno	std	150.00	122.96
607	140	due_tre_giorni	std	135.00	110.66
608	140	quattro_sette_giorni	std	122.00	100.00
609	140	oltre_sette_giorni	std	110.00	90.16
610	141	mezzo_giorno	std	49.70	40.74
611	141	uno_giorno	std	71.00	58.20
612	141	due_tre_giorni	std	64.00	52.46
613	141	quattro_sette_giorni	std	58.00	47.55
614	141	oltre_sette_giorni	std	52.00	42.62
615	142	mezzo_giorno	std	99.40	81.48
616	142	uno_giorno	std	142.00	116.40
617	142	due_tre_giorni	std	128.00	104.92
618	142	quattro_sette_giorni	std	115.00	94.27
619	142	oltre_sette_giorni	std	104.00	85.25
620	143	uno_giorno	std	176.00	\N
621	143	due_tre_giorni	std	158.60	\N
622	143	quattro_sette_giorni	std	143.96	\N
623	143	oltre_sette_giorni	std	129.32	\N
624	144	mezzo_giorno	std	54.00	44.27
625	144	uno_giorno	std	77.00	63.12
626	144	due_tre_giorni	std	69.00	56.56
627	144	quattro_sette_giorni	std	62.00	50.82
628	144	oltre_sette_giorni	std	56.00	45.90
629	145	mezzo_giorno	std	35.00	\N
630	145	uno_giorno	std	50.00	\N
631	145	due_tre_giorni	std	45.00	\N
632	145	quattro_sette_giorni	std	41.00	\N
633	145	oltre_sette_giorni	std	37.00	\N
634	146	mezzo_giorno	std	75.00	\N
635	146	uno_giorno	std	107.00	\N
636	146	due_tre_giorni	std	96.00	\N
637	146	quattro_sette_giorni	std	86.00	\N
638	146	oltre_sette_giorni	std	77.00	\N
639	147	mezzo_giorno	std	35.00	\N
640	147	uno_giorno	std	50.00	\N
641	147	due_tre_giorni	std	45.00	\N
642	147	quattro_sette_giorni	std	41.00	\N
643	147	oltre_sette_giorni	std	37.00	\N
644	148	mezzo_giorno	std	42.70	\N
645	148	uno_giorno	std	61.00	\N
646	148	due_tre_giorni	std	55.00	\N
647	148	quattro_sette_giorni	std	50.00	\N
648	148	oltre_sette_giorni	std	45.00	\N
649	149	uno_giorno	std	177.00	145.09
650	149	due_tre_giorni	std	159.00	130.33
651	149	quattro_sette_giorni	std	143.00	117.21
652	149	oltre_sette_giorni	std	129.00	105.74
653	150	uno_giorno	std	262.00	214.76
654	150	due_tre_giorni	std	236.00	193.45
655	150	quattro_sette_giorni	std	212.00	173.77
656	150	oltre_sette_giorni	std	191.00	156.56
657	151	uno_giorno	std	262.00	214.76
658	151	due_tre_giorni	std	236.00	193.45
659	151	quattro_sette_giorni	std	212.00	173.77
660	151	oltre_sette_giorni	std	191.00	156.56
661	152	mezzo_giorno	std	75.00	61.48
662	152	uno_giorno	std	107.00	87.71
663	152	due_tre_giorni	std	96.00	78.69
664	152	quattro_sette_giorni	std	86.00	70.49
665	152	oltre_sette_giorni	std	77.00	63.12
666	153	uno_giorno	std	217.00	177.87
667	153	due_tre_giorni	std	195.00	159.84
668	153	quattro_sette_giorni	std	176.00	144.26
669	153	oltre_sette_giorni	std	158.00	129.51
670	154	uno_giorno	std	77.00	\N
671	154	due_tre_giorni	std	69.00	\N
672	154	quattro_sette_giorni	std	62.00	\N
673	154	oltre_sette_giorni	std	56.00	\N
674	155	uno_giorno	std	6.10	\N
675	155	due_tre_giorni	std	6.10	\N
676	155	quattro_sette_giorni	std	6.10	\N
677	155	oltre_sette_giorni	std	6.10	\N
678	156	uno_giorno	std	10.00	\N
679	156	due_tre_giorni	std	10.00	\N
680	156	quattro_sette_giorni	std	10.00	\N
681	156	oltre_sette_giorni	std	10.00	\N
682	157	uno_giorno	std	12.20	\N
683	157	due_tre_giorni	std	12.20	\N
684	157	quattro_sette_giorni	std	12.20	\N
685	157	oltre_sette_giorni	std	12.20	\N
686	158	uno_giorno	std	30.50	\N
687	158	due_tre_giorni	std	30.50	\N
688	158	quattro_sette_giorni	std	30.50	\N
689	158	oltre_sette_giorni	std	30.50	\N
690	159	uno_giorno	std	30.50	\N
691	159	due_tre_giorni	std	30.50	\N
692	159	quattro_sette_giorni	std	30.50	\N
693	159	oltre_sette_giorni	std	30.50	\N
694	160	uno_giorno	std	30.50	\N
695	160	due_tre_giorni	std	30.50	\N
696	160	quattro_sette_giorni	std	30.50	\N
697	160	oltre_sette_giorni	std	30.50	\N
698	161	uno_giorno	std	41.00	33.61
699	161	due_tre_giorni	std	36.60	30.00
700	161	quattro_sette_giorni	std	34.00	27.87
701	161	oltre_sette_giorni	std	32.00	26.23
702	162	mezzo_giorno	std	49.70	40.74
703	162	uno_giorno	std	71.00	58.20
704	162	due_tre_giorni	std	64.00	52.46
705	162	quattro_sette_giorni	std	58.00	47.54
706	162	oltre_sette_giorni	std	52.00	42.62
707	163	mezzo_giorno	std	67.20	\N
708	163	uno_giorno	std	96.00	\N
709	163	due_tre_giorni	std	86.00	\N
710	163	quattro_sette_giorni	std	77.00	\N
711	163	oltre_sette_giorni	std	73.00	\N
712	164	mezzo_giorno	std	28.70	\N
713	164	uno_giorno	std	41.00	\N
714	164	due_tre_giorni	std	36.60	\N
715	164	quattro_sette_giorni	std	34.00	\N
716	164	oltre_sette_giorni	std	32.00	\N
717	165	uno_giorno	std	12.00	9.84
718	165	due_tre_giorni	std	12.00	9.84
719	165	quattro_sette_giorni	std	11.00	9.02
720	165	oltre_sette_giorni	std	10.00	8.20
721	166	mezzo_giorno	std	75.00	\N
722	166	uno_giorno	std	107.00	\N
723	166	due_tre_giorni	std	96.00	\N
724	166	quattro_sette_giorni	std	86.00	\N
725	166	oltre_sette_giorni	std	77.00	\N
726	167	uno_giorno	std	41.00	\N
727	167	due_tre_giorni	std	36.60	\N
728	167	quattro_sette_giorni	std	34.00	\N
729	167	oltre_sette_giorni	std	32.00	\N
730	168	uno_giorno	std	77.00	\N
731	168	due_tre_giorni	std	69.00	\N
732	168	quattro_sette_giorni	std	62.00	\N
733	168	oltre_sette_giorni	std	56.00	\N
734	169	uno_giorno	std	161.00	\N
735	169	due_tre_giorni	std	145.00	\N
736	169	quattro_sette_giorni	std	131.00	\N
737	169	oltre_sette_giorni	std	118.00	\N
738	170	uno_giorno	std	176.00	\N
739	170	due_tre_giorni	std	158.60	\N
740	170	quattro_sette_giorni	std	144.00	\N
741	170	oltre_sette_giorni	std	130.00	\N
742	171	uno_giorno	std	221.00	\N
743	171	due_tre_giorni	std	199.00	\N
744	171	quattro_sette_giorni	std	179.00	\N
745	171	oltre_sette_giorni	std	162.00	\N
746	172	uno_giorno	std	262.00	214.76
747	172	due_tre_giorni	std	236.00	193.45
748	172	quattro_sette_giorni	std	212.00	173.77
749	172	oltre_sette_giorni	std	191.00	156.56
750	173	mezzo_giorno	std	112.70	\N
751	173	uno_giorno	std	161.00	\N
752	173	due_tre_giorni	std	145.00	\N
753	173	quattro_sette_giorni	std	131.00	\N
754	173	oltre_sette_giorni	std	118.00	\N
755	174	mezzo_giorno	std	170.80	\N
756	174	uno_giorno	std	244.00	\N
757	174	due_tre_giorni	std	219.60	\N
758	174	quattro_sette_giorni	std	201.30	\N
759	174	oltre_sette_giorni	std	179.30	\N
760	175	mezzo_giorno	std	227.00	\N
761	175	uno_giorno	std	324.00	\N
762	175	due_tre_giorni	std	292.00	\N
763	175	quattro_sette_giorni	std	263.00	\N
764	175	oltre_sette_giorni	std	237.00	\N
765	176	mezzo_giorno	std	214.20	175.41
766	176	uno_giorno	std	306.00	250.00
767	176	due_tre_giorni	std	275.00	225.41
768	176	quattro_sette_giorni	std	247.00	202.46
769	176	oltre_sette_giorni	std	223.00	182.79
770	177	mezzo_giorno	std	99.40	81.48
771	177	uno_giorno	std	142.00	116.40
772	177	due_tre_giorni	std	128.00	104.92
773	177	quattro_sette_giorni	std	115.00	92.62
774	177	oltre_sette_giorni	std	104.00	83.61
775	178	uno_giorno	std	189.00	\N
776	178	due_tre_giorni	std	170.00	\N
777	178	quattro_sette_giorni	std	153.00	\N
778	178	oltre_sette_giorni	std	138.00	\N
779	179	uno_giorno	std	199.00	163.12
780	179	due_tre_giorni	std	179.00	146.72
781	179	quattro_sette_giorni	std	161.00	131.97
782	179	oltre_sette_giorni	std	145.00	118.85
783	180	uno_giorno	std	221.00	181.15
784	180	due_tre_giorni	std	199.00	163.12
785	180	quattro_sette_giorni	std	179.00	146.72
786	180	oltre_sette_giorni	std	162.00	132.79
787	181	uno_giorno	std	199.00	163.12
788	181	due_tre_giorni	std	179.00	146.72
789	181	quattro_sette_giorni	std	161.00	131.97
790	181	oltre_sette_giorni	std	145.00	118.85
791	182	uno_giorno	std	199.00	163.12
792	182	due_tre_giorni	std	179.00	146.72
793	182	quattro_sette_giorni	std	161.00	131.97
794	182	oltre_sette_giorni	std	145.00	118.85
795	183	mezzo_giorno	std	42.70	35.00
796	183	uno_giorno	std	61.00	50.00
797	183	due_tre_giorni	std	55.00	45.09
798	183	quattro_sette_giorni	std	50.00	40.98
799	183	oltre_sette_giorni	std	45.00	36.89
800	184	mezzo_giorno	std	42.70	35.00
801	184	uno_giorno	std	61.00	50.00
802	184	due_tre_giorni	std	55.00	45.09
803	184	quattro_sette_giorni	std	50.00	40.98
804	184	oltre_sette_giorni	std	45.00	36.89
805	185	mezzo_giorno	std	68.60	56.23
806	185	uno_giorno	std	98.00	80.33
807	185	due_tre_giorni	std	88.00	72.13
808	185	quattro_sette_giorni	std	79.00	64.75
809	185	oltre_sette_giorni	std	71.00	58.20
810	186	mezzo_giorno	std	35.00	\N
811	186	uno_giorno	std	50.00	\N
812	186	due_tre_giorni	std	45.00	\N
813	186	quattro_sette_giorni	std	41.00	\N
814	186	oltre_sette_giorni	std	37.00	\N
815	187	mezzo_giorno	std	35.00	\N
816	187	uno_giorno	std	50.00	\N
817	187	due_tre_giorni	std	45.00	\N
818	187	quattro_sette_giorni	std	41.00	\N
819	187	oltre_sette_giorni	std	37.00	\N
820	188	mezzo_giorno	std	42.70	35.00
821	188	uno_giorno	std	61.00	50.00
822	188	due_tre_giorni	std	55.00	45.09
823	188	quattro_sette_giorni	std	50.00	40.98
824	188	oltre_sette_giorni	std	45.00	36.89
825	189	mezzo_giorno	std	42.70	35.00
826	189	uno_giorno	std	61.00	50.00
827	189	due_tre_giorni	std	55.00	45.09
828	189	quattro_sette_giorni	std	50.00	40.98
829	189	oltre_sette_giorni	std	45.00	36.89
830	190	uno_giorno	std	61.00	50.00
831	190	due_tre_giorni	std	55.00	45.09
832	190	quattro_sette_giorni	std	50.00	40.98
833	190	oltre_sette_giorni	std	45.00	36.89
834	191	uno_giorno	std	20.00	\N
835	191	due_tre_giorni	std	18.00	\N
836	191	quattro_sette_giorni	std	16.00	\N
837	191	oltre_sette_giorni	std	14.00	\N
838	192	mezzo_giorno	std	49.70	40.74
839	192	uno_giorno	std	71.00	58.20
840	192	due_tre_giorni	std	64.00	52.46
841	192	quattro_sette_giorni	std	58.00	47.55
842	192	oltre_sette_giorni	std	52.00	42.63
843	193	uno_giorno	std	71.00	\N
844	193	due_tre_giorni	std	64.00	\N
845	193	quattro_sette_giorni	std	58.00	\N
846	193	oltre_sette_giorni	std	52.00	\N
847	194	mezzo_giorno	std	60.00	\N
848	194	uno_giorno	std	86.00	\N
849	194	due_tre_giorni	std	77.00	\N
850	194	quattro_sette_giorni	std	69.30	\N
851	194	oltre_sette_giorni	std	62.40	\N
852	195	mezzo_giorno	std	42.70	\N
853	195	uno_giorno	std	61.00	\N
854	195	due_tre_giorni	std	55.00	\N
855	195	quattro_sette_giorni	std	50.00	\N
856	195	oltre_sette_giorni	std	45.00	\N
857	196	uno_giorno	std	91.00	\N
858	196	due_tre_giorni	std	82.00	\N
859	196	quattro_sette_giorni	std	74.00	\N
860	196	oltre_sette_giorni	std	67.00	\N
861	197	mezzo_giorno	std	75.00	61.48
862	197	uno_giorno	std	107.00	87.71
863	197	due_tre_giorni	std	96.00	78.69
864	197	quattro_sette_giorni	std	86.00	70.49
865	197	oltre_sette_giorni	std	77.00	63.12
866	198	mezzo_giorno	std	75.00	61.48
867	198	uno_giorno	std	107.00	87.71
868	198	due_tre_giorni	std	96.00	78.69
869	198	quattro_sette_giorni	std	86.00	70.49
870	198	oltre_sette_giorni	std	77.00	63.12
871	199	uno_giorno	std	142.00	116.40
872	199	due_tre_giorni	std	128.00	104.92
873	199	quattro_sette_giorni	std	115.00	92.62
874	199	oltre_sette_giorni	std	104.00	83.61
875	200	uno_giorno	std	71.00	58.20
876	200	due_tre_giorni	std	64.00	52.46
877	200	quattro_sette_giorni	std	58.00	47.55
878	200	oltre_sette_giorni	std	52.00	42.63
879	201	mezzo_giorno	std	54.00	44.27
880	201	uno_giorno	std	77.00	63.12
881	201	due_tre_giorni	std	69.00	56.56
882	201	quattro_sette_giorni	std	62.00	50.82
883	201	oltre_sette_giorni	std	56.00	45.90
884	202	uno_giorno	std	98.00	\N
885	202	due_tre_giorni	std	88.00	\N
886	202	quattro_sette_giorni	std	79.00	\N
887	202	oltre_sette_giorni	std	71.00	\N
888	203	mezzo_giorno	std	123.20	100.99
889	203	uno_giorno	std	176.00	144.27
890	203	due_tre_giorni	std	158.60	130.00
891	203	quattro_sette_giorni	std	143.96	118.04
892	203	oltre_sette_giorni	std	129.32	106.56
893	204	uno_giorno	std	56.00	\N
894	204	due_tre_giorni	std	50.00	\N
895	204	quattro_sette_giorni	std	45.00	\N
896	204	oltre_sette_giorni	std	40.50	\N
897	205	uno_giorno	std	61.00	\N
898	205	due_tre_giorni	std	55.00	\N
899	205	quattro_sette_giorni	std	50.00	\N
900	205	oltre_sette_giorni	std	45.00	\N
901	206	uno_giorno	std	217.00	177.87
902	206	due_tre_giorni	std	195.00	159.84
903	206	quattro_sette_giorni	std	176.00	144.26
904	206	oltre_sette_giorni	std	158.00	129.51
905	207	uno_giorno	std	262.00	214.76
906	207	due_tre_giorni	std	236.00	193.44
907	207	quattro_sette_giorni	std	213.00	174.59
908	207	oltre_sette_giorni	std	191.00	156.56
909	208	uno_giorno	std	282.00	\N
910	208	due_tre_giorni	std	253.00	\N
911	208	quattro_sette_giorni	std	228.00	\N
912	208	oltre_sette_giorni	std	205.50	\N
913	209	uno_giorno	std	177.00	\N
914	209	due_tre_giorni	std	159.00	\N
915	209	quattro_sette_giorni	std	143.00	\N
916	209	oltre_sette_giorni	std	129.00	\N
917	210	uno_giorno	std	162.00	\N
918	210	due_tre_giorni	std	146.40	\N
919	210	quattro_sette_giorni	std	134.20	\N
920	210	oltre_sette_giorni	std	119.50	\N
921	211	uno_giorno	std	99.00	81.15
922	211	due_tre_giorni	std	89.00	72.96
923	211	quattro_sette_giorni	std	80.00	65.57
924	211	oltre_sette_giorni	std	72.00	59.02
925	212	uno_giorno	std	144.00	118.04
926	212	due_tre_giorni	std	130.00	106.56
927	212	quattro_sette_giorni	std	117.00	95.90
928	212	oltre_sette_giorni	std	105.00	86.07
929	213	uno_giorno	std	164.00	134.43
930	213	due_tre_giorni	std	147.00	120.50
931	213	quattro_sette_giorni	std	132.00	108.20
932	213	oltre_sette_giorni	std	119.00	97.96
933	214	uno_giorno	std	221.00	181.15
934	214	due_tre_giorni	std	199.00	163.12
935	214	quattro_sette_giorni	std	179.00	146.72
936	214	oltre_sette_giorni	std	162.00	132.79
937	215	uno_giorno	std	162.00	\N
938	215	due_tre_giorni	std	146.40	\N
939	215	quattro_sette_giorni	std	134.20	\N
940	215	oltre_sette_giorni	std	119.50	\N
941	216	uno_giorno	std	199.00	\N
942	216	due_tre_giorni	std	179.00	\N
943	216	quattro_sette_giorni	std	161.00	\N
944	216	oltre_sette_giorni	std	145.00	\N
945	217	mezzo_giorno	std	99.40	\N
946	217	uno_giorno	std	142.00	\N
947	217	due_tre_giorni	std	128.00	\N
948	217	quattro_sette_giorni	std	115.00	\N
949	217	oltre_sette_giorni	std	104.00	\N
950	218	mezzo_giorno	std	75.00	61.48
951	218	uno_giorno	std	107.00	87.71
952	218	due_tre_giorni	std	96.00	78.69
953	218	quattro_sette_giorni	std	86.00	70.49
954	218	oltre_sette_giorni	std	77.00	63.12
955	219	mezzo_giorno	std	75.00	\N
956	219	uno_giorno	std	107.00	\N
957	219	due_tre_giorni	std	96.00	\N
958	219	quattro_sette_giorni	std	86.00	\N
959	219	oltre_sette_giorni	std	77.00	\N
960	220	uno_giorno	std	164.00	134.43
961	220	due_tre_giorni	std	147.00	120.50
962	220	quattro_sette_giorni	std	132.00	108.20
963	220	oltre_sette_giorni	std	119.00	97.54
964	221	uno_giorno	std	189.00	154.92
965	221	due_tre_giorni	std	170.00	139.35
966	221	quattro_sette_giorni	std	153.00	125.41
967	221	oltre_sette_giorni	std	138.00	113.11
968	222	uno_giorno	std	24.00	\N
969	222	due_tre_giorni	std	21.00	\N
970	222	quattro_sette_giorni	std	19.00	\N
971	222	oltre_sette_giorni	std	17.00	\N
972	223	uno_giorno	std	36.00	29.51
973	223	due_tre_giorni	std	32.00	26.23
974	223	quattro_sette_giorni	std	29.00	23.77
975	223	oltre_sette_giorni	std	26.00	21.31
976	224	uno_giorno	std	107.00	87.71
977	224	due_tre_giorni	std	96.00	78.69
978	224	quattro_sette_giorni	std	86.00	70.49
979	224	oltre_sette_giorni	std	77.00	63.12
980	225	uno_giorno	std	107.00	\N
981	225	due_tre_giorni	std	96.00	\N
982	225	quattro_sette_giorni	std	86.00	\N
983	225	oltre_sette_giorni	std	77.00	\N
984	226	mezzo_giorno	std	114.80	\N
985	226	uno_giorno	std	164.00	134.43
986	226	due_tre_giorni	std	147.00	120.50
987	226	quattro_sette_giorni	std	132.00	108.20
988	226	oltre_sette_giorni	std	119.00	97.54
989	227	mezzo_giorno	std	99.40	\N
990	227	uno_giorno	std	142.00	116.40
991	227	due_tre_giorni	std	128.00	104.92
992	227	quattro_sette_giorni	std	115.00	94.26
993	227	oltre_sette_giorni	std	104.00	85.25
994	228	uno_giorno	std	24.00	19.68
995	228	due_tre_giorni	std	21.00	17.22
996	228	quattro_sette_giorni	std	19.00	15.57
997	228	oltre_sette_giorni	std	17.00	13.93
998	229	uno_giorno	std	71.00	58.20
999	229	due_tre_giorni	std	64.00	52.46
1000	229	quattro_sette_giorni	std	58.00	47.54
1001	229	oltre_sette_giorni	std	52.00	42.62
1002	230	uno_giorno	std	71.00	58.20
1003	230	due_tre_giorni	std	64.00	52.46
1004	230	quattro_sette_giorni	std	58.00	47.54
1005	230	oltre_sette_giorni	std	52.00	42.62
1006	234	uno_giorno	std	142.00	\N
1007	234	due_tre_giorni	std	128.00	\N
1008	234	quattro_sette_giorni	std	115.00	\N
1009	234	oltre_sette_giorni	std	104.00	\N
1010	235	uno_giorno	std	71.00	\N
1011	235	due_tre_giorni	std	64.00	\N
1012	235	quattro_sette_giorni	std	58.00	\N
1013	235	oltre_sette_giorni	std	52.00	\N
1014	236	uno_giorno	std	129.00	\N
1015	236	due_tre_giorni	std	116.00	\N
1016	236	quattro_sette_giorni	std	104.00	\N
1017	236	oltre_sette_giorni	std	94.00	\N
1018	237	uno_giorno	std	12.00	9.84
1019	237	due_tre_giorni	std	12.00	9.84
1020	237	quattro_sette_giorni	std	12.00	9.84
1021	237	oltre_sette_giorni	std	10.00	8.20
1022	238	uno_giorno	std	142.00	\N
1023	238	due_tre_giorni	std	128.00	\N
1024	238	quattro_sette_giorni	std	115.00	\N
1025	238	oltre_sette_giorni	std	104.00	\N
1026	239	uno_giorno	std	199.00	\N
1027	239	due_tre_giorni	std	179.00	\N
1028	239	quattro_sette_giorni	std	161.00	\N
1029	239	oltre_sette_giorni	std	145.00	\N
1030	240	uno_giorno	std	199.00	\N
1031	240	due_tre_giorni	std	179.00	\N
1032	240	quattro_sette_giorni	std	161.00	\N
1033	240	oltre_sette_giorni	std	145.00	\N
1034	241	uno_giorno	std	199.00	\N
1035	241	due_tre_giorni	std	179.00	\N
1036	241	quattro_sette_giorni	std	161.00	\N
1037	241	oltre_sette_giorni	std	145.00	\N
1038	242	uno_giorno	std	498.00	\N
1039	242	due_tre_giorni	std	449.00	\N
1040	242	quattro_sette_giorni	std	405.00	\N
1041	242	oltre_sette_giorni	std	365.00	\N
1042	243	mezzo_giorno	std	114.80	\N
1043	243	uno_giorno	std	164.00	\N
1044	243	due_tre_giorni	std	147.00	\N
1045	243	quattro_sette_giorni	std	132.00	\N
1046	243	oltre_sette_giorni	std	119.00	\N
1047	244	uno_giorno	std	142.00	116.40
1048	244	due_tre_giorni	std	128.00	104.92
1049	244	quattro_sette_giorni	std	115.00	92.62
1050	244	oltre_sette_giorni	std	104.00	83.61
1051	245	uno_giorno	std	161.00	\N
1052	245	due_tre_giorni	std	145.00	\N
1053	245	quattro_sette_giorni	std	131.00	\N
1054	245	oltre_sette_giorni	std	118.00	\N
1055	246	uno_giorno	std	217.00	177.87
1056	246	due_tre_giorni	std	195.00	159.84
1057	246	quattro_sette_giorni	std	176.00	144.27
1058	246	oltre_sette_giorni	std	158.00	129.51
1059	247	uno_giorno	std	177.00	145.09
1060	247	due_tre_giorni	std	159.00	130.33
1061	247	quattro_sette_giorni	std	143.00	117.22
1062	247	oltre_sette_giorni	std	129.00	105.74
1063	248	uno_giorno	std	189.00	154.91
1064	248	due_tre_giorni	std	170.00	139.35
1065	248	quattro_sette_giorni	std	153.00	125.41
1066	248	oltre_sette_giorni	std	138.00	113.12
1067	249	uno_giorno	std	217.00	\N
1068	249	due_tre_giorni	std	195.00	\N
1069	249	quattro_sette_giorni	std	176.00	\N
1070	249	oltre_sette_giorni	std	158.00	\N
\.


--
-- Data for Name: noleggio_macchine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.noleggio_macchine (id, nome, note_tecniche, categoria, carburante, deposito_cauzionale, attiva, created_at, updated_at, famiglia, is_accessorio) FROM stdin;
124	Aera-Vator  cm 150 + Seminatrice	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
125	Rigeneratrice Land Pride cm. 130	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
126	Rigeneratrice Vredo cm. 140	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
127	Carotatrice 3 punti cm. 180	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
128	Arieggiatore Verticutter cm. 152	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
129	Arieggiatore con raccolta cm. 160	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
130	Bucatrice Selvatici cm.160 - 12/18	SOLO X NS KIOTI	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
131	Erpice rottante MTZ 170 cm. 155	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
132	Fresa interrasassi da cm 155	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
133	Trinciaerba MA 160 mazze CM.160	TRINCIA FINO AD UN MAX DI Ø2,5	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
134	Motocoltivatore con fresa 12 HP	FRESA NORMALE LARGH. CM 90	tappeto_erboso	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
135	Interrasassi cm 66 - Erpice rotante cm 75	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
136	Motocoltivatore OREC SF 60 E	LARGHEZZA CM. 50	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
137	Motozappa VIKING da cm. 45	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
138	Rigeneratrice RYAN cm. 60.	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
139	Rigeneratrice SEMBDNER RS-60N	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
140	Rigeneratrice TORO 23512 cm. 50.	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
141	Rigeneratrice BLUEBIRD cm. 56.	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
142	Carotatrice/Bucatrice PL 2501	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
143	Arieggiatore a molle a traino 100 x trattorino	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
144	Arieggiatore a molle Classen 50	SOLO PER CHI HA I ROBOT	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
145	Arieggiatori  HONDA S 35-45-60 E TORO 55	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
146	Arieggiatore VR60 semov. lame mobili PROFESSIONALE -  non si piega il manico , caricare solo su furgoncini	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
147	Arieggiatore 34 a molle/lame a batteria STIHL	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
148	Spandisabbia manuale cm 80 MINI TOPPER	\N	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
149	Spandisabbia Noblat lt. 350	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
150	Spandisabbia a traino lt. 1800	A CARDANO	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
151	Spandisabbia Noblat a traino lt. 2000	A PRESE IDRAULICHE	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
152	Dumper Hinowa autocaricante benzina	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
153	Idrosemina da lt. 1100	\N	tappeto_erboso	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
154	Golf Car Attiva Macchina elettrica	prima di darlo a noleggio chiedere a Fabio e comunicarco con anticipo ai ragazzi per prepararlo - NON CIRCOLA X STRADA	tappeto_erboso	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
155	Seminatrice a mano per MICORIZE	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
156	Seminatrice a mano SOLO Kg. 9	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
157	Seminatrice a spinta lt. 16 cm. 43 WOLF	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
158	Seminatrice a spinta lt. 50 cm.80 ROTA DAIRON	in ferro	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
159	Raccogli carote a spinta cm.50	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
160	Spandiconcime Rotativo kg. 56 a mano	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
161	Spandiconcime rotativo traino lt. 100	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
162	Irroratrice a batteria mt. 2	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
163	Spandiconcime / irroratrice semovente	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
164	Rullo spanditerriccio 25A a rete a spinta	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
165	Rullo cm 50	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
166	Rullo SEMBDNER da cm. 80.	\N	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
167	Rullo SEMBDNER da cm.60 bucatura	si può applicare a SEMIN. RS 60	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
168	Biotrituratore NEGRI R 95 B 9 hp ruote	tritura fino a 5/6 cm	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
169	Biotrituratore NEGRI R 230 M ruote + stretto può stare su furgone tipo ns giallo	tritura fino a 11 cm	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
170	Biotrituratore NEGRI R 240 M cingolato	tritura fino a 9 cm	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
171	Biotrituratore NEGRI R 280/330 carrellato/                        stradale con gancio traino	tritura fino a 14 cm	attrezzi	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
172	Biotrituratore NEGRI R 280 Cingolo	tritura fino a 14 cm	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
173	Fresa ceppi PRAXIS/ RAYCO RG13 a                 ruote	\N	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
174	Fresa ceppi TORO STX 26 a cingoli	fresa fino ad un max di Ø50 cm	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
175	Fresa ceppi TORO STX 38 a cingoli PESO:8Q	fresa fino ad un max di Ø100 cm e +	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
176	Fresa ceppi TORO DINGO	\N	attrezzi	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
177	Catenaria BARRETO 712 MT	prof.cm  40/ largh. cm 8	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
178	Catenaria VERMEER RT 100	prof. cm90/ largh. cm. 10	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
179	Seminatrice SEMBDNER RS-60N	LA NR. 2 FA DA RIGENERA SE SI AGGIUNGE IL RULLO	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
180	Seminatrice SEMBDNER RS-80N	\N	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
181	Seminatrice SEMBDNER-80 H	\N	attrezzi	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
182	Seminatrice a rulli cm. 180 a trattore	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
183	Potatore ECHO PPT 265.	\N	attrezzi	M	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
184	Tosasiepi ad asta ECHO HCA 265	\N	attrezzi	M	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
185	Motosega da legna da cm 75.	\N	attrezzi	M	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
186	Decespugliatore\\ Motosega	B — M	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
187	Rasaerba\\ Tosasiepi.	B — M	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
188	Atomizzatore a zaino    12lt.	\N	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
189	Attrezzi a batteria Stihl	1 pz.	attrezzi	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
190	Rete scarificatrice cm 183.	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
191	Rete livella.76x10kg 122x30kg - 183x56kg	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
192	Piastra vibrante AVP 1240	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
193	Spaccalegna E  7 Ton. FINO A Ø25 CM	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
194	Piantapali Easy 35 per punta da Ø60/80/100 mm	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
195	Trivella mono-operatore Stihl BT 131. CON PUNTA Ø60-80-100-140-200-300	\N	tagliaerba	M	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
196	Trivella a trattore con punte Ømm. 100/150/200/400	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
197	Tagliazolle TURFCO	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
198	Spazzola a motore	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
199	Aspirafoglie a sponda tornado 13	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
200	Aspirafoglie Semovente BG	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
201	Elimina talpe	il prodotto serbatorio va con una mix di benzina+gasolio al 2%	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
202	Idropulitrice a benzina 9 hp-lungh. Tubo 20mt	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
203	Rastrello semov. cm. 91 Pre-Seeder	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
204	Generatore di corrente Honda 2 Kw               con sistema inverter	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
205	Generatore di corrente Honda 5 Kw           solo x uso cantiere	no schede elettroniche	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
206	Grillo FD 2200 Piatto/Trinciaerba	\N	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	f
207	Grillo FD 2200 Trincia raccolta	\N	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	f
208	Grillo FD 2200 Ariegg. Raccolta	DA PREPARARE CON COLTELLI	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	f
209	Grillo FD 500 2WD solo raccolta con piatto da cm 113	Non circola x strada	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	f
210	Grillo FK 700 Trinciaerba largh. 115	\N	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	f
211	Piatto/Trinciaerba cm 160 x FD 2200	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	t
212	Trincia-raccolta 160 x FD 2200	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	t
213	Arieggia-raccolta 160 x FD 2200	DA PREPARARE CON COLTELLI	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo FD	t
214	MeanGreen Majoris Batteria cm. 152	\N	tagliaerba	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
215	Toro 7000 Laterale piatto cm 130/ Ferris ISX 3300 da c. 155	Non circola x strada — G — B	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Toro	f
216	Toro 7210 piatto cm 130/7500 scarico post. cm. 157	Non circola x strada	tagliaerba	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Toro	f
217	Grillo Climber 9.22  / FERRIS 400S con piatto cm 122 con mulching o scarico posteriore	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Grillo Climber	f
218	Trinciaerba - OREC HRC cm. 80	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
219	Trattorino rasaerba Stihl RT 6112.1 ZL con piatto cm. 115	\N	tagliaerba	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
220	Minipala Avant 423	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	f
221	Minipala Avant 528	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	f
222	Benna cm. 100 - Benna con denti cm. 130 - Forca pallet - Bracetto	solo su AVANT 528	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	t
223	Forca ramaglie	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	t
224	Spazzola per bordi	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	t
225	Braccio tagliasiepe BJ 150 taglia fino a Ø2 cm - alt. Verticale 4 mt - alt.barra orriz. 3 mt	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Avant	t
226	Dingo Toro TX 525	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Dingo Toro	f
227	Fresaceppi	accessorio	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Dingo Toro	t
228	Benna per terra cm. 90 - Rompi suolo	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Dingo Toro	t
229	Catenaria 90 x 10	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Dingo Toro	t
230	Trivella mm. 100/150/200/400	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Dingo Toro	t
231	Escavatore q. 35	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Escavatore q.35	t
232	Pinza per ramaglie	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Escavatore q.35	t
233	Trinciaerba da cm. 80	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Escavatore q.35	t
234	Miniescavatore q. 17 JCB/ YANMAR 4.0 con benna mt.1/ cm.50/ cm. 30	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	JCB 17	f
235	Trivella x escav.JCB 17 con punte mm. 100/150/200/400	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	JCB 17	t
236	Miniescavatore q. 8 JCB con benna cm.80/ cm.35/ cm. 25	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	JCB 8	f
237	Rampe in alluminio mt. 3,5 q. 22	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	JCB 8	t
238	Trattore 4 rm  da 20 a 30 hp SHIBAURA	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Trattori	f
239	Trattore EOS 6.60 TARGATO/ BCS VALIANT 60	60 HP — 60 HP	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Trattori	f
240	Trattore John Deere 4520	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Trattori	f
241	Trattore  4 rm  da 50 a 80 hp KIOTI RUOTE GARDEN - TARGATO	60 HP	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Trattori	f
242	Trinciaforestale radiocomandato a cingoli HYMACH	trita fino a Ø6/10 cm	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Trinciaforestale	f
243	Rasaerba a batteria radiocomandata a cingoli BLUEBIRD	\N	escavatori	\N	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	\N	f
244	Piattaf. a cingoli mt. 5 Pantografo	\N	escavatori	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
245	Piattaforma a cingoli mt. 14-15.	\N	escavatori	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
246	Piattaforma a cingoli mt. 19.	\N	escavatori	B	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
247	Piattaforma autocarrata mt. 16.	\N	escavatori	B/GPL	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
248	Piattaforma autocarrata mt. 20.	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
249	Piattaforma autocarrata mt. 24. 4.0	\N	escavatori	G	\N	t	2026-03-11 14:23:09.672547+00	2026-03-11 14:23:09.672547+00	Piattaforme	f
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
-- Data for Name: pratovivo_archivio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pratovivo_archivio (id, created_at, nome_cliente, mq, tipo_intervento, tipo_prato, livello, linea, terreno, colore, irrigazione, tipo_cliente, degradazione, estendi12, liquidi_sab, miscuglio_id, miscuglio_nome, totale_preventivo, pdf_params, note) FROM stdin;
4f577c67-f55e-4d37-88a8-cbf30f23d25c	2026-03-12 08:22:12.011496+00	\N	200	piano_annuo	ornamentale	standard	albatros	normale	intenso	centralizzata	privato	\N	t	t	\N	\N	\N	{"mq": 200, "linea": "albatros", "colore": "intenso", "livello": "standard", "terreno": "normale", "estendi12": true, "miscuglio": null, "tipoPrato": "ornamentale", "liquidiSab": true, "irrigazione": "centralizzata", "nomeCliente": "", "tipoCliente": "privato", "degradazione": null, "tipoIntervento": "piano_annuo", "primoConcimeIncluso": false}	\N
22772449-023a-47fd-aff6-7054fba899f2	2026-03-12 16:51:16.166467+00	Parisi Giovanni	2000	piano_annuo	ornamentale	standard	albatros	normale	pallido	mano	privato	\N	t	t	\N	\N	\N	{"mq": 2000, "linea": "albatros", "colore": "pallido", "livello": "standard", "terreno": "normale", "estendi12": true, "miscuglio": null, "tipoPrato": "ornamentale", "liquidiSab": true, "irrigazione": "mano", "nomeCliente": "Parisi Giovanni", "tipoCliente": "privato", "degradazione": null, "tipoIntervento": "piano_annuo", "primoConcimeIncluso": false}	\N
4627956f-2eea-4cb0-8d16-b07a9c027f48	2026-03-12 16:52:33.16283+00	Parisi Giovanni	2000	piano_annuo	ornamentale	standard	albatros	normale	pallido	mano	privato	\N	t	t	\N	\N	1573.8	{"mq": 2000, "linea": "albatros", "colore": "pallido", "livello": "standard", "terreno": "normale", "estendi12": true, "miscuglio": null, "tipoPrato": "ornamentale", "liquidiSab": true, "irrigazione": "mano", "nomeCliente": "Parisi Giovanni", "tipoCliente": "privato", "degradazione": null, "tipoIntervento": "piano_annuo", "primoConcimeIncluso": false}	\N
bc389761-7198-4b45-8e63-46dd3c64a563	2026-03-12 16:53:20.221159+00	Parisi Giovanni	2000	piano_annuo	ornamentale	standard	mivena	normale	pallido	mano	privato	\N	t	t	\N	\N	\N	{"mq": 2000, "linea": "mivena", "colore": "pallido", "livello": "standard", "terreno": "normale", "estendi12": true, "miscuglio": null, "tipoPrato": "ornamentale", "liquidiSab": true, "irrigazione": "mano", "nomeCliente": "Parisi Giovanni", "tipoCliente": "privato", "degradazione": null, "tipoIntervento": "piano_annuo", "primoConcimeIncluso": false}	\N
20e78f2e-893b-40d0-bc9f-e3d265679f3f	2026-03-12 16:53:47.110669+00	Parisi Giovanni	2000	piano_annuo	ornamentale	standard	mivena	normale	pallido	mano	privato	\N	t	t	\N	\N	1436.5	{"mq": 2000, "linea": "mivena", "colore": "pallido", "livello": "standard", "terreno": "normale", "estendi12": true, "miscuglio": null, "tipoPrato": "ornamentale", "liquidiSab": true, "irrigazione": "mano", "nomeCliente": "Parisi Giovanni", "tipoCliente": "privato", "degradazione": null, "tipoIntervento": "piano_annuo", "primoConcimeIncluso": false}	\N
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
fcb4dfc2-66a2-47d5-993f-c0dd9250a9f2	Honda	Rasaerba HRN536C2 VYEH	1	2026-03-10 16:12:25.685047+00	2026-03-10 16:12:25.685047+00
8bba6d69-31ff-4314-9bf6-f81e7fe18680	Honda	Rasaerba HRX476C2 HYEH	1	2026-03-11 08:26:37.110807+00	2026-03-11 08:26:37.110807+00
81f19a3d-5f8d-47bc-a644-f0dd333d4a34	Grillo	 Trimmer HWT600	1	2026-03-11 09:27:14.688724+00	2026-03-11 09:27:14.688724+00
6bdb3481-9f87-4010-8fa9-414984bd4f8f	Stihl	Decespugliatore FS 55 R	1	2026-03-11 16:13:47.400221+00	2026-03-11 16:13:47.400221+00
ee7c8f08-c0eb-46b9-9951-6ac324c15c49	Honda	Trattorino rasaerba HF2625 HMEH	1	2026-03-12 14:52:05.497766+00	2026-03-12 14:52:05.497766+00
c5c4c695-cc6c-40dd-802f-752d46eb34d0	Honda	 HRH536K4 HXEH	1	2026-03-12 15:58:28.65461+00	2026-03-12 15:58:28.65461+00
6fc67579-df21-4f34-8374-988d2c9ea191	Honda	Rasaerba HRD536K4 HXEH	1	2026-03-12 16:09:27.718701+00	2026-03-12 16:09:27.718701+00
7d356723-e5f6-418e-9796-ff9058a46e63	YAMABIKO CORP.	Motosega CS-362TES	1	2026-03-12 16:11:19.735763+00	2026-03-12 16:11:19.735763+00
309823da-1b1a-4e15-b18d-aaad1cd0c499	YAMABIKO	 CS-362TES	1	2026-03-12 16:30:16.371864+00	2026-03-12 16:30:16.371864+00
992ada64-45b0-4317-ae60-5f5ab19e9c43	YAMABIKO	Motosega CS-362TES	1	2026-03-12 16:33:44.69112+00	2026-03-12 16:33:44.69112+00
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
-- Data for Name: messages_2026_03_13; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_13 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_14; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_14 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_15; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_03_15 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
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

SELECT pg_catalog.setval('public.inventory_id_seq', 292, true);


--
-- Name: noleggio_abbonamenti_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.noleggio_abbonamenti_id_seq', 1, false);


--
-- Name: noleggio_listini_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.noleggio_listini_id_seq', 1070, true);


--
-- Name: noleggio_macchine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.noleggio_macchine_id_seq', 249, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 3441, true);


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
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


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
-- Name: noleggio_abbonamenti noleggio_abbonamenti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_abbonamenti
    ADD CONSTRAINT noleggio_abbonamenti_pkey PRIMARY KEY (id);


--
-- Name: noleggio_listini noleggio_listini_macchina_id_fascia_tipo_listino_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_listini
    ADD CONSTRAINT noleggio_listini_macchina_id_fascia_tipo_listino_key UNIQUE (macchina_id, fascia, tipo_listino);


--
-- Name: noleggio_listini noleggio_listini_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_listini
    ADD CONSTRAINT noleggio_listini_pkey PRIMARY KEY (id);


--
-- Name: noleggio_macchine noleggio_macchine_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_macchine
    ADD CONSTRAINT noleggio_macchine_pkey PRIMARY KEY (id);


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
-- Name: pratovivo_archivio pratovivo_archivio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pratovivo_archivio
    ADD CONSTRAINT pratovivo_archivio_pkey PRIMARY KEY (id);


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
-- Name: messages_2026_03_13 messages_2026_03_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_13
    ADD CONSTRAINT messages_2026_03_13_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_14 messages_2026_03_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_14
    ADD CONSTRAINT messages_2026_03_14_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_15 messages_2026_03_15_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_03_15
    ADD CONSTRAINT messages_2026_03_15_pkey PRIMARY KEY (id, inserted_at);


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
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


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
-- Name: pratovivo_archivio_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pratovivo_archivio_created_at_idx ON public.pratovivo_archivio USING btree (created_at DESC);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


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
-- Name: messages_2026_03_13_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_13_inserted_at_topic_idx ON realtime.messages_2026_03_13 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_14_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_14_inserted_at_topic_idx ON realtime.messages_2026_03_14 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_15_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_03_15_inserted_at_topic_idx ON realtime.messages_2026_03_15 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


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
-- Name: messages_2026_03_13_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_13_inserted_at_topic_idx;


--
-- Name: messages_2026_03_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_13_pkey;


--
-- Name: messages_2026_03_14_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_14_inserted_at_topic_idx;


--
-- Name: messages_2026_03_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_14_pkey;


--
-- Name: messages_2026_03_15_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_15_inserted_at_topic_idx;


--
-- Name: messages_2026_03_15_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_15_pkey;


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
-- Name: noleggio_listini noleggio_listini_macchina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.noleggio_listini
    ADD CONSTRAINT noleggio_listini_macchina_id_fkey FOREIGN KEY (macchina_id) REFERENCES public.noleggio_macchine(id) ON DELETE CASCADE;


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
-- Name: pratovivo_archivio Allow all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all" ON public.pratovivo_archivio USING (true);


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
-- Name: noleggio_abbonamenti allow_all_noleggio_abbonamenti; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY allow_all_noleggio_abbonamenti ON public.noleggio_abbonamenti USING (true) WITH CHECK (true);


--
-- Name: noleggio_listini allow_all_noleggio_listini; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY allow_all_noleggio_listini ON public.noleggio_listini USING (true) WITH CHECK (true);


--
-- Name: noleggio_macchine allow_all_noleggio_macchine; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY allow_all_noleggio_macchine ON public.noleggio_macchine USING (true) WITH CHECK (true);


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
-- Name: noleggio_abbonamenti; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.noleggio_abbonamenti ENABLE ROW LEVEL SECURITY;

--
-- Name: noleggio_listini; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.noleggio_listini ENABLE ROW LEVEL SECURITY;

--
-- Name: noleggio_macchine; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.noleggio_macchine ENABLE ROW LEVEL SECURITY;

--
-- Name: operatori; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.operatori ENABLE ROW LEVEL SECURITY;

--
-- Name: pratovivo_archivio; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pratovivo_archivio ENABLE ROW LEVEL SECURITY;

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

\unrestrict VapJtfoq4efyegwR6NyejYBVaLZzbhQKJaUpyBkn9Hsj7AFEUsOS2nwHN50bNlp

