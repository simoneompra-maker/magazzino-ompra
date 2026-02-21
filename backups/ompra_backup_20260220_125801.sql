--
-- PostgreSQL database dump
--

\restrict YG8nMIcMm6x4aBFiZaprUC4A1bz5Uk3tsmOr5Ref5GqYLUYHbaF5oZZpQ1NEHIi

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.8 (Ubuntu 17.8-1.pgdg24.04+1)

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
DROP POLICY IF EXISTS "Allow all operations on commissioni" ON public.commissioni;
DROP POLICY IF EXISTS "Accesso completo listini" ON public.listini;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
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
DROP INDEX IF EXISTS public.idx_status;
DROP INDEX IF EXISTS public.idx_serial;
DROP INDEX IF EXISTS public.idx_commissioni_status;
DROP INDEX IF EXISTS public.idx_commissioni_created;
DROP INDEX IF EXISTS public.idx_commissioni_cliente;
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
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_23 DROP CONSTRAINT IF EXISTS messages_2026_02_23_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_22 DROP CONSTRAINT IF EXISTS messages_2026_02_22_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_21 DROP CONSTRAINT IF EXISTS messages_2026_02_21_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_20 DROP CONSTRAINT IF EXISTS messages_2026_02_20_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_19 DROP CONSTRAINT IF EXISTS messages_2026_02_19_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_18 DROP CONSTRAINT IF EXISTS messages_2026_02_18_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2026_02_17 DROP CONSTRAINT IF EXISTS messages_2026_02_17_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.listini DROP CONSTRAINT IF EXISTS listini_pkey;
ALTER TABLE IF EXISTS ONLY public.listini DROP CONSTRAINT IF EXISTS listini_brand_codice_key;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pkey;
ALTER TABLE IF EXISTS ONLY public.commissioni DROP CONSTRAINT IF EXISTS commissioni_pkey;
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
DROP TABLE IF EXISTS realtime.messages_2026_02_23;
DROP TABLE IF EXISTS realtime.messages_2026_02_22;
DROP TABLE IF EXISTS realtime.messages_2026_02_21;
DROP TABLE IF EXISTS realtime.messages_2026_02_20;
DROP TABLE IF EXISTS realtime.messages_2026_02_19;
DROP TABLE IF EXISTS realtime.messages_2026_02_18;
DROP TABLE IF EXISTS realtime.messages_2026_02_17;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.listini;
DROP SEQUENCE IF EXISTS public.inventory_id_seq;
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.commissioni;
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
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
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
    user_id text
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
    location text DEFAULT 'main'::text
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
    data_aggiornamento timestamp with time zone DEFAULT now()
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
-- Name: messages_2026_02_17; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_17 (
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
-- Name: messages_2026_02_18; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_18 (
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
-- Name: messages_2026_02_19; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_19 (
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
-- Name: messages_2026_02_20; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_20 (
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
-- Name: messages_2026_02_21; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_21 (
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
-- Name: messages_2026_02_22; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_22 (
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
-- Name: messages_2026_02_23; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_02_23 (
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
-- Name: messages_2026_02_17; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_17 FOR VALUES FROM ('2026-02-17 00:00:00') TO ('2026-02-18 00:00:00');


--
-- Name: messages_2026_02_18; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_18 FOR VALUES FROM ('2026-02-18 00:00:00') TO ('2026-02-19 00:00:00');


--
-- Name: messages_2026_02_19; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_19 FOR VALUES FROM ('2026-02-19 00:00:00') TO ('2026-02-20 00:00:00');


--
-- Name: messages_2026_02_20; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_20 FOR VALUES FROM ('2026-02-20 00:00:00') TO ('2026-02-21 00:00:00');


--
-- Name: messages_2026_02_21; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_21 FOR VALUES FROM ('2026-02-21 00:00:00') TO ('2026-02-22 00:00:00');


--
-- Name: messages_2026_02_22; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_22 FOR VALUES FROM ('2026-02-22 00:00:00') TO ('2026-02-23 00:00:00');


--
-- Name: messages_2026_02_23; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_23 FOR VALUES FROM ('2026-02-23 00:00:00') TO ('2026-02-24 00:00:00');


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
-- Data for Name: commissioni; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.commissioni (id, created_at, cliente, cliente_info, telefono, operatore, prodotti, accessori, totale, caparra, metodo_pagamento, note, tipo_documento, status, completed_at, iva_compresa, user_id) FROM stdin;
recovered-131	2026-01-28 11:00:00+00	Favero Giardini Di Favero Mirco	\N	\N	Simone	[]	[{"nome": "GANCIO TRAINO AVANT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	200	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone
recovered-130	2026-01-28 11:00:00+00	Haprilla Kola	\N	\N	Simone	[]	[{"nome": "Trattorino John Deere x 165 usato, visto e piaciuto nello stato in cui si trova", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	1350	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone
recovered-165	2026-02-14 11:00:00+00	Osan Emil Augustin	\N	\N	Simone	[{"brand": "STIHL", "model": "Tagliasiepi HL 92 C-E", "prezzo": 790, "aliquotaIva": 22, "serialNumber": "542187474"}]	[]	790	\N	\N	\N	scontrino	completed	2026-02-14 11:00:00+00	t	Simone
recovered-143	2026-02-07 11:00:00+00	Menegaldo Bruno	\N	\N	Simone	[{"brand": "Stihl", "model": "MOTOSEGA STIHL MS 661", "prezzo": 1630, "aliquotaIva": 22, "serialNumber": "193 545 593"}]	[]	1630	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone
recovered-144	2026-02-07 11:00:00+00	XHELAJ REMZI	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "POTATORE KVS 8000", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "SL3325 371 NB"}, {"brand": "ACCESSORI", "model": "FORBICE KV 390", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "PZ 2925 390NB"}]	[{"nome": "1 CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	840	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone
recovered-145	2026-02-07 11:00:00+00	Xhelaj Kreshnik	\N	\N	Simone	[{"brand": "ECHO", "model": "Motosega CS 2511 TES", "prezzo": 439, "aliquotaIva": 22, "serialNumber": "C 74638144456"}]	[]	439	\N	\N	\N	scontrino	completed	2026-02-07 11:00:00+00	t	Simone
recovered-140	2026-02-06 11:00:00+00	COMMISSATI FRANCESCA	\N	\N	Simone	[{"brand": "STIHL", "model": "BIOTRITURATORE GHE 105", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "451998874"}]	[{"nome": "Stihl POTATORE GTA 26 942966195", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AS 2 937201708", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATT. AL 1 718061245", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	609	\N	\N	\N	scontrino	completed	2026-02-06 11:00:00+00	t	Simone
recovered-141	2026-02-06 11:00:00+00	CARRARO PAOLO	\N	\N	Simone	[{"brand": "Stihl", "model": "Motosega MS 231", "prezzo": 539, "aliquotaIva": 22, "serialNumber": "194 053 082"}]	[]	539	\N	\N	\N	scontrino	completed	2026-02-06 11:00:00+00	t	Simone
recovered-142	2026-02-05 11:00:00+00	AZ. AGR. SEMPREVERDE DI TOFFOLI SONIA	\N	\N	Simone	[{"brand": "Stihl", "model": "TOSASIEPI HLA 135", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "449925313"}]	[{"nome": "CUFFIA OPTIME", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}, {"nome": "CUFFIA KRAMP", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	704.1	\N	\N	\N	scontrino	completed	2026-02-05 11:00:00+00	t	Simone
recovered-138	2026-02-02 11:00:00+00	MA.DI. GREEN di Diego Mardegan	\N	\N	Simone	[{"brand": "Stihl", "model": "TOSASIEPI HS82 R cm 75", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "197814730"}, {"brand": "Stihl", "model": "TOSASIEPI HSA140R cm 75", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "451286601"}]	[{"nome": "PALETTA MANUALE", "prezzo": 0, "quantita": 4, "aliquotaIva": 22}, {"nome": "MANICO ZM-V4", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}]	1677.14	\N	\N	\N	scontrino	completed	2026-02-02 11:00:00+00	t	Simone
recovered-162	2026-02-02 11:00:00+00	Bimetal	\N	\N	Simone	[]	[{"nome": "61 PMM3 Piccolo Micro Mini Catena", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}, {"nome": "catena m47-91", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CATENA 91 - 53M", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}, {"nome": "CATENA 1/4 1,1 52M", "prezzo": 0, "quantita": 3, "aliquotaIva": 22}]	132.55	\N	\N	\N	scontrino	completed	2026-02-02 11:00:00+00	t	Simone
recovered-136	2026-01-30 11:00:00+00	Tonini Srl	\N	\N	Simone	[]	[{"nome": "Pantalone Echo antitaglio", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	95	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone
recovered-134	2026-01-30 11:00:00+00	Taffarello Daniele	\N	\N	Simone	[{"brand": "Volpi", "model": "POTATORE VOLPI KVS 7100P", "prezzo": 409, "aliquotaIva": 22, "serialNumber": "SRØ123 Ø773LS"}]	[]	409	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone
recovered-135	2026-01-30 11:00:00+00	Piovesan Andrea	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "Motosega MS 231", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "194053039"}]	[{"nome": "TANICA MOTOMIX 5 L", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	566.5	\N	\N	\N	scontrino	completed	2026-01-30 11:00:00+00	t	Simone
recovered-132	2026-01-28 11:00:00+00	Vacilotto Valerio	\N	\N	Simone	[{"brand": "STIHL", "model": "FORBICE STIHL ASA 20", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "707610915"}]	[{"nome": "BATTERIA AS 2", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATT. AL 101", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	219	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone
recovered-133	2026-01-28 11:00:00+00	AZ. AGR. POSSAMAI GIULIANO e C.	\N	\N	Simone	[{"brand": "ECHO", "model": "MOTOSEGA DCS 2500 T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "T 91435039178"}]	[{"nome": "BATTERIA LBP 50-150", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATT. LCJQ-560", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	708	\N	\N	\N	scontrino	completed	2026-01-28 11:00:00+00	t	Simone
recovered-129	2026-01-26 11:00:00+00	PAOLO BARBON	\N	\N	Simone	[]	[{"nome": "TRINCIAERBA CARDANO 3 VELOCITA\\nWBBC537SCV", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	1350	\N	\N	\N	scontrino	completed	2026-01-26 11:00:00+00	t	Simone
recovered-128	2026-01-23 11:00:00+00	TONINI SRL	\N	\N	Simone	[{"brand": "Echo", "model": "MOTOSEGA CS 2511 TES", "prezzo": 439, "aliquotaIva": 22, "serialNumber": "C87940041531"}]	[]	439	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone
recovered-124	2026-01-20 11:00:00+00	CORTESE MIRCO	\N	\N	Simone	[]	[{"nome": "POTATORE HTA 50", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATTERIA AL 101", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AK2O", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	459	\N	\N	\N	scontrino	completed	2026-01-20 11:00:00+00	t	Simone
recovered-126	2026-01-23 11:00:00+00	AZ. AGR. Moz Moreno	\N	\N	Simone	[]	[{"nome": "SET CINTURA ADVANCE X-FLEX N°4", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	98	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone
recovered-127	2026-01-23 11:00:00+00	Bortolato Alessandro	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "1 Motosega MS 182", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "837 262 464"}]	[{"nome": "1 Mix Marline 5LT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "1 Olio PRO-UP 2LT", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	417	\N	\N	\N	scontrino	completed	2026-01-23 11:00:00+00	t	Simone
recovered-125	2026-01-22 11:00:00+00	BIANCO DAVIDE	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega CS3410", "prezzo": 269, "aliquotaIva": 22, "serialNumber": "F09238003622"}]	[]	269	\N	\N	\N	scontrino	completed	2026-01-22 11:00:00+00	t	Simone
recovered-123	2026-01-19 11:00:00+00	Toffolo Alessandro	\N	\N	Simone	[]	[{"nome": "Pantalone Stihl Function", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	119	\N	\N	\N	scontrino	completed	2026-01-19 11:00:00+00	t	Simone
recovered-119	2026-01-17 11:00:00+00	Gardin Adriano	\N	\N	Simone	[{"brand": "VARIE", "model": "POTATORE VOLPI KVS 8000", "prezzo": 220, "aliquotaIva": 22, "serialNumber": "SL 2025.165NB"}]	[]	220	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone
recovered-120	2026-01-17 11:00:00+00	WALTER RIZZATO	\N	\N	Simone	[{"brand": "STIHL", "model": "MOTOSGA MS 182", "prezzo": 379, "aliquotaIva": 22, "serialNumber": "837 262 267"}]	[]	379	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone
recovered-122	2026-01-17 11:00:00+00	Fossaluzza Sandro	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "MOTOSEGA MS 194 T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "547317805"}]	[{"nome": "CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	359	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone
recovered-121	2026-01-17 11:00:00+00	CARNIEL MARCO	\N	\N	Simone	[]	[{"nome": "IMPIANTO ANTIZANZARE GEYSER PRO, 43 UGELLI", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	2350	\N	\N	\N	scontrino	completed	2026-01-17 11:00:00+00	t	Simone
recovered-118	2026-01-16 11:00:00+00	Moretti Marco	\N	\N	Simone	[{"brand": "VARIE", "model": "MOTOSEGA MSA 161 T", "prezzo": 425, "aliquotaIva": 22, "serialNumber": "451890971"}]	[]	425	\N	\N	\N	scontrino	completed	2026-01-16 11:00:00+00	t	Simone
recovered-114	2026-01-16 11:00:00+00	AZ. AGR. La Quercia Di Dal Ben Igor	\N	\N	Simone	[]	[{"nome": "CATENE 52 MAGLIE 1,1 mm", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}, {"nome": "BIOPLUS 20 LITRI", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "HP ULTRA LT 5", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	203.8	\N	\N	\N	scontrino	completed	2026-01-16 11:00:00+00	t	Simone
recovered-112	2026-01-14 11:00:00+00	Zanardo Fabio	\N	\N	Simone	[{"brand": "ACCESSORI", "model": "ECHO MOTOSEGA CS 2511 TES", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "C87940041634"}]	[{"nome": "FORBICE", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CATENA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	488	\N	\N	\N	scontrino	completed	2026-01-14 11:00:00+00	t	Simone
recovered-113	2026-01-14 11:00:00+00	GRACIS PAOLO VIA C. BATTIISTI 47/A VOLPAGO	\N	\N	Simone	[]	[{"nome": "SPACCALEGNA SUG 700 7 TONN.", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	860	\N	\N	\N	scontrino	completed	2026-01-14 11:00:00+00	t	Simone
recovered-108	2026-01-12 11:00:00+00	Green Style Srl	\N	\N	Simone	[{"brand": "VARIE", "model": "Tosasiepi Stihl HLA 66", "prezzo": 405, "aliquotaIva": 22, "serialNumber": "452306770"}]	[]	405	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone
recovered-110	2026-01-12 11:00:00+00	MORO ENRICO	\N	\N	Simone	[{"brand": "Echo", "model": "Motosega ECHO DCS 2500T", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "C 81535021918"}]	[{"nome": "BATTERIA LBP 56V 125  E83935013630", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICA BATT. LCJQ 560C  T91435038990 KIT ENERGIA", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	708	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone
recovered-111	2026-01-12 11:00:00+00	IFAF SPA VIA CALNOVA 105 30020 NOVENTA DIP.	\N	\N	Simone	[]	[{"nome": "SNOWEX SPARGISALS SNOWEX", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "VEE PRO 6000", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	7900	\N	\N	\N	scontrino	completed	2026-01-12 11:00:00+00	t	Simone
recovered-116	2026-01-10 11:00:00+00	ROSSI GIANCARLO VIA CARBONCINE 76 BIANCADE	\N	\N	Simone	[{"brand": "WEIBANG", "model": "TRINCIAERBA WEIBANG 3. VEL. WBBC 532 SCV", "prezzo": 1350, "aliquotaIva": 22, "serialNumber": "WBC537SCV/S021B&250103036"}]	[]	1350	\N	\N	\N	scontrino	completed	2026-01-10 11:00:00+00	t	Simone
recovered-115	2026-01-09 11:00:00+00	De Zottis sas	\N	\N	Simone	[]	[{"nome": "SOFFIATORE BGA 60 452325465", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "BATTERIA AK30 912721072", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "CARICABATTERIE AL 101 702817745", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	369	\N	\N	\N	scontrino	completed	2026-01-09 11:00:00+00	t	Simone
recovered-105	2026-01-09 11:00:00+00	MICHELE GOLFETTO	\N	\N	Simone	[]	[{"nome": "TRONCARAMI RS 750", "prezzo": 0, "quantita": 2, "aliquotaIva": 22}]	134	\N	\N	\N	scontrino	completed	2026-01-09 11:00:00+00	t	Simone
recovered-104	2026-01-07 11:00:00+00	Battistel Thomas	\N	\N	Simone	[{"brand": "STIHL", "model": "SOFFIATORI BGA 160", "prezzo": 0, "aliquotaIva": 22, "serialNumber": "450906088"}]	[{"nome": "SPRAY SUPERCLEAN", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	360	\N	\N	\N	scontrino	completed	2026-01-07 11:00:00+00	t	Simone
recovered-87	2026-01-07 11:00:00+00	MIOTTO BENIAMINO	\N	\N	Simone	[]	[{"nome": "SEGACCIO ARS 470mm", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}, {"nome": "MANICO TELES. EXP 5.5", "prezzo": 0, "quantita": 1, "aliquotaIva": 22}]	190	\N	\N	\N	scontrino	completed	2026-01-07 11:00:00+00	t	Simone
1771139919865	2026-02-14 11:00:00+00	Piovesan Andrea	{"id": "513052", "cap": "31050", "nome": "Piovesan Andrea", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "MONASTIER DI TREVISO", "telefono": "3202725545", "indirizzo": "VIA PAVANI, 37A", "provincia": "TV", "searchText": "piovesan andrea monastier di treviso ", "telefonoOriginale": "3202725545"}	3202725545	Simone	[]	[{"id": 1771139908345, "nome": "Affilatore catena Stihl", "prezzo": 52, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	52	\N	\N	\N	scontrino	completed	2026-02-14 11:00:00+00	t	user_1770584612559
1770209552033	2026-02-04 12:52:32.033+00	Guidolin Luigi	{"id": "202474", "cap": "31035", "nome": "Guidolin Luigi", "email": "riccardoguidolin@icloud.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "CROCETTA DEL MONTELLO", "telefono": "3474737356", "indirizzo": "VIA FANTIN, 100", "provincia": "TV", "searchText": "guidolin luigi crocetta del montello ", "telefonoOriginale": "3474737356"}	3474737356	Simone	[{"brand": "ECHO", "model": "Batteria LBP-50-150", "prezzo": 200, "isOmaggio": false, "serialNumber": "U54635022744"}]	[]	200	100	carta	\N	fattura	completed	2026-02-04 12:52:32.033+00	t	user_1769961017929
1770385464630	2026-02-06 13:44:24.631+00	AZ. AGR. Moz Moreno	{"id": "510801", "cap": "30100", "nome": "AZ. AGR. Moz Moreno", "email": "fattoriaimpronta@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "VENEZIA", "telefono": "3408032699", "indirizzo": "VIA PASSO CAMPALTO, 15A - CAMPALTO", "provincia": "VE", "searchText": "az. agr. moz moreno venezia ", "telefonoOriginale": "3408032699"}	3408032699	Simone	[]	[{"id": 1770385435974, "nome": "Zaino supporto tosasiepi", "prezzo": 400, "quantita": 1, "descrizione": "ZAINO SUPPORTO TOSASIEPI"}]	400	\N	\N	I.C.	fattura	completed	2026-02-06 13:44:24.631+00	t	user_1769961017929
1770626009165	2026-02-09 08:33:29.165+00	Moretti Marco	{"id": "202904", "cap": "31100", "nome": "Moretti Marco", "email": "moretti72.marco@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3392050119", "indirizzo": "VIA TIMAVO", "provincia": "TV", "searchText": "moretti marco treviso ", "telefonoOriginale": "3392050119"}	3392050119	Simone	[{"brand": "", "model": "MOTOSEGA MSA 161 T", "prezzo": 425, "isOmaggio": false, "serialNumber": "451890971"}]	[]	425	\N	\N	\N	fattura	completed	2026-02-09 08:33:29.165+00	t	user_1769961017929
1770744173693	2026-02-10 17:22:53.693+00	Camarotto Michele	{"id": "502091", "cap": "30020", "nome": "Camarotto Michele", "email": "saradilegui@libero.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "FOSSALTA DI PIAVE", "telefono": "3484460983", "indirizzo": "VIA PASSO LAMPOL, 27/A", "provincia": "VE", "searchText": "camarotto michele fossalta di piave ", "telefonoOriginale": "3484460983"}	3484460983	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV295", "prezzo": 199, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "ZA1625.124NB"}]	[]	199	\N	\N	\N	scontrino	completed	2026-02-10 17:22:53.693+00	t	user_1769961017929
1770801828120	2026-02-11 09:23:48.12+00	Nico Giardini Di Bastarolo Nicola	{"id": "504139", "cap": "31059", "nome": "Nico Giardini Di Bastarolo Nicola", "email": "nickbast74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "ZERO BRANCO", "telefono": "3498200169", "indirizzo": "VIA G.B. GUIDINI, 29", "provincia": "TV", "searchText": "nico giardini di bastarolo nicola zero branco ", "telefonoOriginale": "3498200169"}	3498200169	Simone	[]	[{"id": 1770801600789, "nome": "Manicotti antitaglio ", "prezzo": 48, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801636352, "nome": "Ricambio Archman svettatoio ", "prezzo": 16, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801660760, "nome": "Visiera completa", "prezzo": 10, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801714594, "nome": "Cosciale copri pantaloni ", "prezzo": 17, "quantita": 1, "matricola": null, "aliquotaIva": 22}, {"id": 1770801775018, "nome": "Filo dice 3 mm 50 metri quadro R304342", "prezzo": 13.9, "quantita": 3, "matricola": null, "aliquotaIva": 22}, {"id": 1770801796561, "nome": "Svettatoio Archman ", "prezzo": 120, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	252.7	\N	\N	\N	fattura	completed	2026-02-11 09:23:48.12+00	t	user_1769961017929
1770997818464	2026-02-13 15:50:18.464+00	Scomparin Pierino	{"id": "502251", "cap": "31057", "nome": "Scomparin Pierino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SILEA", "telefono": "3394191177", "indirizzo": "VIA BELVEDERE, 71", "provincia": "TV", "searchText": "scomparin pierino silea ", "telefonoOriginale": "3394191177"}	3394191177	Simone	[{"brand": "STIHL", "model": "Batteria AS2 (28 Wh)", "prezzo": 42, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "950420572"}]	[]	42	\N	\N	\N	scontrino	completed	2026-02-13 15:50:18.464+00	t	user_1769961017929
1771231859301	2026-02-16 11:00:00+00	Bisetto Mario	{"id": "502153", "cap": "31030", "nome": "Bisetto Mario", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "CARBONERA", "telefono": "3493730882", "indirizzo": "VIA CODALUNGA, 135", "provincia": "TV", "searchText": "bisetto mario carbonera ", "telefonoOriginale": "3493730882"}	3493730882	Simone	[{"brand": "STIHL", "model": "Decespugliatore FSA 80 R", "prezzo": 509, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "546519977"}, {"brand": "STIHL", "model": "Caricabatterie AL 101", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "702817744"}, {"brand": "STIHL", "model": "Batteria AK 30.0S", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "912736933"}]	[]	509	\N	\N	\N	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929
1771258833161	2026-02-16 11:00:00+00	Balanza Marino	{"id": "509979", "cap": "31048", "nome": "Balanza Marino", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "SAN BIAGIO DI CALLALTA", "telefono": "3466323236", "indirizzo": "VIA CLAUDIA AUGUSTA, 6", "provincia": "TV", "searchText": "balanza marino san biagio di callalta ", "telefonoOriginale": "3466323236"}	3466323236	Simone	[{"brand": "VOLPI", "model": "Forbice elettronica KV390", "prezzo": 459, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "PZ2925.389NB"}, {"brand": "VOLPI", "model": "Potatore KVS6000", "prezzo": 200, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "SM4222498LS"}]	[{"id": 1771258823114, "nome": "Occhiali ", "prezzo": 5, "quantita": 1, "matricola": null, "aliquotaIva": 22}]	664	\N	\N	Potatore senza batterie	scontrino	completed	2026-02-16 11:00:00+00	t	user_1769961017929
1771333556925	2026-02-17 11:00:00+00	Eos Cooperativa Sociale	{"id": "508412", "cap": "31033", "nome": "Eos Cooperativa Sociale", "email": "info@eoscooperativa.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "CASTELFRANCO VENETO", "telefono": "3402249187", "indirizzo": "VIA OSPEDALE, 10", "provincia": "TV", "searchText": "eos cooperativa sociale castelfranco veneto ", "telefonoOriginale": "3402249187"}	3402249187	Simone	[]	[{"id": 1771333442068, "nome": "Stihl bobina filo tondo 2,7 MT 208 art. 0000 930 2227", "prezzo": 29.28, "quantita": 51, "matricola": null, "aliquotaIva": 22}]	1493.28	\N	\N	Consegnare e ritirare 36 bobine filo 2,7 347 MT art. 0000 930 2289	fattura	completed	2026-02-17 11:00:00+00	t	user_1769961017929
1771492465151	2026-02-19 11:00:00+00	Sartori Luca	{"id": "203045", "cap": "31100", "nome": "Sartori Luca", "email": "sartoriluca74@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "TREVISO", "telefono": "3494968896", "indirizzo": "VIA S.ANTONINO 288", "provincia": "TV", "searchText": "sartori luca treviso ", "telefonoOriginale": "3494968896"}	3494968896	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310977"}]	[]	350	\N	\N	Pagamento BB fine mese	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929
1771493646908	2026-02-19 11:00:00+00	Buffon Giancarlo	{"id": "512986", "cap": "31038", "nome": "Buffon Giancarlo", "email": "", "nomeP": "", "cognome": "", "contatto": "", "localita": "PAESE", "telefono": "3496148085", "indirizzo": "VIA MARONCELLI 6", "provincia": "TV", "searchText": "buffon giancarlo paese ", "telefonoOriginale": "3496148085"}	3496148085	Simone	[{"brand": "STIHL", "model": "Tagliabordi FSA 30.0", "prezzo": 159, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "838110682"}, {"brand": "STIHL", "model": "Caricabatterie AL 1", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "935280185"}, {"brand": "STIHL", "model": "Batteria AS 2", "prezzo": null, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "937056842"}]	[{"id": 1771493623647, "nome": "Ricambio polycut", "prezzo": 4, "quantita": 2, "matricola": null, "aliquotaIva": 22}]	167	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	f	user_1769961017929
1771498408037	2026-02-19 11:00:00+00	AZ. AGR. Vivai Piante Di Dragancea Andrei	{"id": "202724", "cap": "31056", "nome": "AZ. AGR. Vivai Piante Di Dragancea Andrei", "email": "andrei.dragancea@gmail.com", "nomeP": "", "cognome": "", "contatto": "", "localita": "RONCADE", "telefono": "3282670287", "indirizzo": "VIA ARRIGO BOITO, 10 - BIANCADE", "provincia": "TV", "searchText": "az. agr. vivai piante di dragancea andrei roncade ", "telefonoOriginale": "3282670287"}	3282670287	Simone	[{"brand": "STIHL", "model": "Motosega MSA 190.0 T", "prezzo": 350, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "452310979"}]	[]	350	\N	\N	\N	fattura	completed	2026-02-19 11:00:00+00	t	user_1769961017929
1771514517527	2026-02-19 11:00:00+00	Gasparini Francesco	{"id": "505627", "cap": "30020", "nome": "Gasparini Francesco", "email": "gasparini.francesco@virgilio.it", "nomeP": "", "cognome": "", "contatto": "", "localita": "MEOLO", "telefono": "3939936820", "indirizzo": "VIA CA' CORNER SUD, 49", "provincia": "VE", "searchText": "gasparini francesco meolo ", "telefonoOriginale": "3939936820"}	3939936820	Simone	[{"brand": "Stihl", "model": "Atomizzatore SR 430 Mistblower", "prezzo": 760, "isOmaggio": false, "aliquotaIva": 22, "serialNumber": "370193762"}]	[]	760	\N	\N	\N	scontrino	completed	2026-02-19 11:00:00+00	t	user_1769961017929
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory (id, "timestamp", action, brand, model, "serialNumber", cliente, prezzo, totale, status, "user", location) FROM stdin;
178	2026-02-16 08:50:59.119+00	SCARICO	STIHL	Batteria AK 30.0S	912736933	Bisetto Mario	0	0	sold	user_1769961017929	main
177	2026-02-16 08:50:58.969+00	SCARICO	STIHL	Caricabatterie AL 101	702817744	Bisetto Mario	0	0	sold	user_1769961017929	main
183	2026-02-19 09:12:21.296+00	CARICO	STIHL	Motosega MSA 190.0 T	452310977	\N	\N	\N	available	user_1769961017929	main
188	2026-02-19 09:34:06.327+00	SCARICO	STIHL	Tagliabordi FSA 30.0	838110682	Buffon Giancarlo	0	0	sold	user_1769961017929	main
193	2026-02-19 10:53:27.211+00	SCARICO	STIHL	Motosega MSA 190.0 T	452310979	AZ. AGR. Vivai Piante Di Dragancea Andrei	0	0	sold	user_1769961017929	main
197	2026-02-19 21:43:48.742+00	SCARICO	STIHL	Tagliasiepi HL 92 C-E	542187474	Habitat Natura Di Simone Taffarello	0	0	sold	user_1770584612559	main
108	2026-01-12 11:00:00+00	VENDITA	VARIE	Tosasiepi Stihl HLA 66 (SN: 452306770)	NOMAT-1770550419458	Green Style Srl	405	405	sold	Simone	main
111	2026-01-12 11:00:00+00	VENDITA	SNOWEX	SNOWEX SPARGISALS SNOWEX + VEE PRO 6000	NOMAT-1770589476407	IFAF SPA VIA CALNOVA 105 30020 NOVENTA DIP.	7900	7900	sold	Simone	main
112	2026-01-14 11:00:00+00	VENDITA	ACCESSORI	ECHO MOTOSEGA CS 2511 TES (SN: C87940041634) + FORBICE  + CATENA	NOMAT-1770615936616	Zanardo Fabio	488	488	sold	Simone	main
113	2026-01-14 11:00:00+00	VENDITA	VARIE	SPACCALEGNA SUG 700 7 TONN.	NOMAT-1770616271153	GRACIS PAOLO VIA C. BATTIISTI 47/A VOLPAGO	860	860	sold	Simone	main
114	2026-01-16 11:00:00+00	VENDITA	ACCESSORI	CATENE 52 MAGLIE 1,1 mm x2 + BIOPLUS 20 LITRI + HP ULTRA LT 5	NOMAT-1770616937887	AZ. AGR. La Quercia Di Dal Ben Igor	203.8	203.8	sold	Simone	main
115	2026-01-09 11:00:00+00	VENDITA	ACCESSORI	SOFFIATORE BGA 60 452325465 + BATTERIA AK30 912721072 + CARICABATTERIE AL 101 702817745	NOMAT-1770617231010	De Zottis sas	369	369	sold	Simone	main
116	2026-01-10 11:00:00+00	VENDITA	WEIBANG	WEIBANG TRINCIAERBA WEIBANG 3. VEL. WBBC 532 SCV (SN: WBC537SCV/S021B&250103036)	NOMAT-1770617528321	ROSSI GIANCARLO VIA CARBONCINE 76 BIANCADE	1350	1350	sold	Simone	main
117	2026-01-16 11:00:00+00	VENDITA	STIHL	MSA 161 T	451890971	Moretti Marco	425	425	sold	Simone	main
119	2026-01-17 11:00:00+00	VENDITA	VARIE	POTATORE VOLPI KVS 8000 (SN: SL 2025.165NB)	NOMAT-1770626174900	Gardin Adriano	220	220	sold	Simone	main
121	2026-01-17 11:00:00+00	VENDITA	VARIE	IMPIANTO ANTIZANZARE GEYSER PRO, 43 UGELLI	NOMAT-1770626491337	CARNIEL MARCO	2350	2350	sold	Simone	main
122	2026-01-17 11:00:00+00	VENDITA	ACCESSORI	MOTOSEGA MS 194 T (SN: 547317805) + CATENA	NOMAT-1770626684538	Fossaluzza Sandro	359	359	sold	Simone	main
123	2026-01-19 11:00:00+00	VENDITA	ACCESSORI	Pantalone Stihl Function	NOMAT-1770626836963	Toffolo Alessandro	119	119	sold	Simone	main
126	2026-01-23 11:00:00+00	VENDITA	ACCESSORI	SET CINTURA ADVANCE X-FLEX N°4	NOMAT-1770627347884	AZ. AGR. Moz Moreno	98	98	sold	Simone	main
127	2026-01-23 11:00:00+00	VENDITA	ACCESSORI	1 Motosega MS 182 (SN: 837 262 464) + 1 Mix Marline 5LT + 1 Olio PRO-UP 2LT	NOMAT-1770627577462	Bortolato Alessandro	417	417	sold	Simone	main
59	2026-01-16 10:28:29.791+00	CARICO	STIHL	MSA 161 T	451890971	\N	\N	\N	available	user_1766825174502	main
131	2026-01-28 11:00:00+00	VENDITA	ACCESSORI	GANCIO TRAINO AVANT	NOMAT-1770628289583	Favero Giardini Di Favero Mirco	200	200	sold	Simone	main
134	2026-01-30 11:00:00+00	VENDITA	Volpi	Volpi POTATORE VOLPI KVS 7100P (SN: SRØ123 Ø773LS)	NOMAT-1770628839453	Taffarello Daniele	409	409	sold	Simone	main
136	2026-01-30 11:00:00+00	VENDITA	ACCESSORI	Pantalone Echo antitaglio	NOMAT-1770629102868	Tonini Srl	95	95	sold	Simone	main
138	2026-02-02 11:00:00+00	VENDITA	Stihl	Stihl TOSASIEPI HS82 R cm 75 (SN: 197814730) + Stihl TOSASIEPI HSA140R cm 75 (SN: 451286601) + PALETTA MANUALE x4 + MANICO ZM-V4 x3	NOMAT-1770629456775	MA.DI. GREEN di Diego Mardegan	1677.1399999999999	1677.14	sold	Simone	main
141	2026-02-06 11:00:00+00	VENDITA	Stihl	Stihl Motosega MS 231 (SN: 194 053 082)	NOMAT-1770629840641	CARRARO PAOLO	539	539	sold	Simone	main
104	2026-01-07 11:00:00+00	VENDITA	STIHL	STIHL SOFFIATORI BGA 160 (SN: 450906088) + SPRAY SUPERCLEAN	NOMAT-1770542601552	Battistel Thomas	360	360	sold	Simone	main
125	2026-01-22 11:00:00+00	VENDITA	Echo	Motosega CS3410 (SN: F09238003622)	NOMAT-1770627118231	BIANCO DAVIDE	269	269	sold	Simone	main
87	2026-01-07 11:00:00+00	VENDITA	ACCESSORI	SEGACCIO ARS 470mm + MANICO TELES. EXP 5.5	NOMAT-1770538424954	MIOTTO BENIAMINO	190	190	sold	Simone	main
133	2026-01-28 11:00:00+00	VENDITA	ECHO	MOTOSEGA DCS 2500 T (SN: T 91435039178) + BATTERIA LBP 50-150 + CARICA BATT. LCJQ-560	NOMAT-1770628732478	AZ. AGR. POSSAMAI GIULIANO e C.	708	708	sold	Simone	main
132	2026-01-28 11:00:00+00	VENDITA	STIHL	FORBICE STIHL ASA 20 (SN: 707610915) + BATTERIA AS 2 + CARICABATT. AL 101	NOMAT-1770628454115	Vacilotto Valerio	219	219	sold	Simone	main
128	2026-01-23 11:00:00+00	VENDITA	Echo	MOTOSEGA CS 2511 TES (SN: C87940041531)	NOMAT-1770627778411	TONINI SRL	439	439	sold	Simone	main
129	2026-01-26 11:00:00+00	VENDITA	weibang	TRINCIAERBA CARDANO 3 VELOCITA\nWBBC537SCV	NOMAT-1770628005264	PAOLO BARBON	1350	1350	sold	Simone	main
130	2026-01-28 11:00:00+00	VENDITA		Trattorino John Deere x 165 usato, visto e piaciuto nello stato in cui si trova	NOMAT-1770628179893	Haprilla Kola	1350	1350	sold	Simone	main
124	2026-01-20 11:00:00+00	VENDITA	Stihl	POTATORE HTA 50 + CARICA BATTERIA AL 101 + BATTERIA AK2O	NOMAT-1770626999774	CORTESE MIRCO	459	459	sold	Simone	main
120	2026-01-17 11:00:00+00	VENDITA	STIHL	MOTOSGA MS 182 (SN: 837 262 267)	NOMAT-1770626309484	WALTER RIZZATO	379	379	sold	Simone	main
135	2026-01-30 11:00:00+00	VENDITA	ACCESSORI	Motosega MS 231 (SN: 194053039) + TANICA MOTOMIX 5 L	NOMAT-1770628981076	Piovesan Andrea	566.5	566.5	sold	Simone	main
140	2026-02-06 11:00:00+00	VENDITA	STIHL	STIHL BIOTRITURATORE GHE 105 (SN: 451998874) + Stihl POTATORE GTA 26 942966195 + BATTERIA AS 2 937201708 + CARICABATT. AL 1 718061245	NOMAT-1770629736627	COMMISSATI FRANCESCA	609	609	sold	Simone	main
142	2026-02-05 11:00:00+00	VENDITA	Stihl	Stihl TOSASIEPI HLA 135 (SN: 449925313) + CUFFIA OPTIME x2 + CUFFIA KRAMP	NOMAT-1770630123643	AZ. AGR. SEMPREVERDE DI TOFFOLI SONIA	704.1	704.1	sold	Simone	main
173	2026-02-16 08:43:04.075+00	CARICO	STIHL	Decespugliatore FSA 80 R	546519977	\N	\N	\N	available	user_1769961017929	main
174	2026-02-16 08:43:04.075+00	CARICO	STIHL	Batteria AK 30.0S	912736933	\N	\N	\N	available	user_1769961017929	main
175	2026-02-16 08:43:04.075+00	CARICO	STIHL	Caricabatterie AL 101	702817744	\N	\N	\N	available	user_1769961017929	main
179	2026-02-16 16:17:05.943+00	CARICO	VOLPI	Forbice elettronica KV390	PZ2925.389NB	\N	\N	\N	available	user_1769961017929	main
180	2026-02-16 16:17:05.943+00	CARICO	VOLPI	Potatore KVS6000	SM4222498LS	\N	\N	\N	available	user_1769961017929	main
184	2026-02-19 09:14:24.352+00	SCARICO	STIHL	Motosega MSA 190.0 T	452310977	Sartori Luca	0	0	sold	user_1769961017929	main
189	2026-02-19 09:34:06.583+00	SCARICO	STIHL	Caricabatterie AL 1	935280185	Buffon Giancarlo	0	0	sold	user_1769961017929	main
190	2026-02-19 09:34:06.74+00	SCARICO	STIHL	Batteria AS 2	937056842	Buffon Giancarlo	0	0	sold	user_1769961017929	main
194	2026-02-19 15:20:42.325+00	CARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	\N	\N	\N	available	user_1769961017929	main
195	2026-02-19 15:20:43.639+00	CARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	\N	\N	\N	available	user_1769961017929	main
143	2026-02-07 11:00:00+00	VENDITA	Stihl	Stihl MOTOSEGA STIHL MS 661 (SN: 193 545 593)	NOMAT-1770630223483	Menegaldo Bruno	1630	1630	sold	Simone	main
144	2026-02-07 11:00:00+00	VENDITA	ACCESSORI	POTATORE KVS 8000 (SN: SL3325 371 NB) + FORBICE KV 390 (SN: PZ 2925 390NB) + 1 CATENA	NOMAT-1770630351510	XHELAJ REMZI	840	840	sold	Simone	main
145	2026-02-07 11:00:00+00	VENDITA	ECHO	ECHO Motosega CS 2511 TES (SN: C 74638144456)	NOMAT-1770630501655	Xhelaj Kreshnik	439	439	sold	Simone	main
176	2026-02-16 08:50:58.236+00	SCARICO	STIHL	Decespugliatore FSA 80 R	546519977	Bisetto Mario	0	0	sold	user_1769961017929	main
181	2026-02-16 16:20:32.201+00	SCARICO	VOLPI	Forbice elettronica KV390	PZ2925.389NB	Balanza Marino	0	0	sold	user_1769961017929	main
182	2026-02-16 16:20:32.984+00	SCARICO	VOLPI	Potatore KVS6000	SM4222498LS	Balanza Marino	0	0	sold	user_1769961017929	main
185	2026-02-19 09:30:48.458+00	CARICO	STIHL	Tagliabordi FSA 30.0	838110682	\N	\N	\N	available	user_1769961017929	main
186	2026-02-19 09:30:48.458+00	CARICO	STIHL	Batteria AS 2	937056842	\N	\N	\N	available	user_1769961017929	main
187	2026-02-19 09:30:48.458+00	CARICO	STIHL	Caricabatterie AL 1	935280185	\N	\N	\N	available	user_1769961017929	main
191	2026-02-19 10:50:01.694+00	CARICO	STIHL	Motosega MSA 190.0 T	452310979	\N	\N	\N	available	user_1769961017929	main
105	2026-01-09 11:00:00+00	VENDITA	ACCESSORI	TRONCARAMI RS 750 x2	NOMAT-1770546596554	MICHELE GOLFETTO	134	134	sold	Simone	main
110	2026-01-12 11:00:00+00	VENDITA	Echo	Echo Motosega ECHO DCS 2500T (SN: C 81535021918) + BATTERIA LBP 56V 125  E83935013630 + CARICA BATT. LCJQ 560C  T91435038990 KIT ENERGIA	NOMAT-1770571853303	MORO ENRICO	708	708	sold	Simone	main
192	2026-02-19 10:50:02.949+00	CARICO	STIHL	Motosega MSA 190.0 T	452310979	\N	\N	\N	available	user_1769961017929	main
196	2026-02-19 15:21:57.175+00	SCARICO	Stihl	Atomizzatore SR 430 Mistblower	370193762	Gasparini Francesco	0	0	sold	user_1769961017929	main
162	2026-02-02 11:00:00+00	VENDITA	ACCESSORI	61 PMM3 Piccolo Micro Mini Catena x3 + catena m47-91 + CATENA 91 - 53M x3 + CATENA 1/4 1,1 52M x3	NOMAT-1771001013437	Bimetal	132.55	132.55	sold	Simone	main
163	2026-02-14 10:43:20.253+00	CARICO	STIHL	Tagliasiepi HL 92 C-E	542187474	\N	\N	\N	available	user_1769961017929	main
171	2026-02-14 11:00:00+00	VENDITA	ACCESSORI	Affilatore catena Stihl	NOMAT-1771139919436	Piovesan Andrea	52	52	sold	Simone	main
\.


--
-- Data for Name: listini; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listini (id, brand, categoria, codice, descrizione, confezione, prezzo_a, prezzo_b, prezzo_c, prezzo_d, iva, data_aggiornamento) FROM stdin;
6addf429-fd78-48a1-bfd1-5dfb60b15ad8	GEOGREEN	Sementi	SHUR701	Hurricane 7	10 kg	108.90	104.00	98.80	89.00	10.00	2026-02-18 18:28:51.815+00
f6dc79b7-b1b2-4c21-aab3-415f26fb5b66	GEOGREEN	Sementi	SHUR005	Hurricane (Sole+Ombra)	5 kg	54.45	52.00	50.00	\N	10.00	2026-02-18 18:28:51.815+00
23507e86-2a24-4a41-9642-6b72cc429f68	GEOGREEN	Sementi	SHUR001	Hurricane	1 kg	13.75	\N	\N	\N	10.00	2026-02-18 18:28:51.815+00
f4ae7b91-057b-4827-bcf4-5a6990691464	GEOGREEN	Sementi	SBLI01	Blizzard	10 kg	97.90	93.00	88.50	80.00	10.00	2026-02-18 18:28:51.815+00
1b98639f-b108-4d41-a422-9603a887c7d5	GEOGREEN	Sementi	SBLI005	Blizzard (Sole+Ombra)	5 kg	54.45	52.00	50.00	\N	10.00	2026-02-18 18:28:51.815+00
692a8188-8bd8-4e11-9049-69eb8aad2274	GEOGREEN	Sementi	SSTR01	Strong	10 kg	85.80	81.50	77.50	70.00	10.00	2026-02-18 18:28:51.815+00
09433623-a0f4-45c6-b59c-d1657d819628	GEOGREEN	Sementi	SSTR005	Strong (Sole+Ombra)	5 kg	46.75	44.50	42.30	\N	10.00	2026-02-18 18:28:51.815+00
17cb3d17-160e-4e31-8764-d4c159eb328a	GEOGREEN	Sementi	SNOS01	No-sun	10 kg	85.80	81.50	77.50	69.80	10.00	2026-02-18 18:28:51.815+00
5142a042-dc43-4b6b-a6ae-e9aa7668137d	GEOGREEN	Sementi	SNOS005	No-sun (Ombra)	5 kg	46.75	44.50	42.30	\N	10.00	2026-02-18 18:28:51.815+00
ccb0a0ad-f6a8-40f6-8890-a48fe2b6ed2c	GEOGREEN	Sementi	SREN01-SP	Renovate Sport (Rigenerazione)	10 kg	99.00	94.00	89.30	80.40	10.00	2026-02-18 18:28:51.815+00
98cbc907-abe6-4af7-a512-afb899001e4a	GEOGREEN	Sementi	STWI01	Twister (calpestio sole+ombra)	10 kg	119.90	114.00	108.30	97.50	10.00	2026-02-18 18:28:51.815+00
f4fe5b27-f137-47e8-9dbe-5324222a7883	GEOGREEN	Sementi	STOR01	Tornado	10 kg	101.75	96.70	91.90	82.80	10.00	2026-02-18 18:28:51.815+00
b93fc8d8-4869-4442-89c0-8337131f78c3	GEOGREEN	Sementi	SECO01	Ecograss	10 kg	71.50	68.00	64.60	58.20	10.00	2026-02-18 18:28:51.815+00
5c208d1a-0ad8-4455-ae7a-60fed87226db	GEOGREEN	Sementi	SWIN01	Winter Sport	10 kg	73.70	70.00	66.50	60.00	10.00	2026-02-18 18:28:51.815+00
ae3336c5-533f-4a22-8ae8-a7e117e31db9	GEOGREEN	Sementi	MICOPG1	Micosat F prati & giardini	1 kg	31.20	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
de0199f5-fcea-4d5e-874a-4d86d819504b	GEOGREEN	Sementi	MICOTP1	Micosat F Tab Plus	1 kg	49.82	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
98130bf4-3208-4f06-98aa-b3f5fbbde735	GEOGREEN	Sementi	MICOL1	Micosat F Len	1 kg	54.00	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
1fb48c69-c0d0-4508-9f25-abe6bace13dd	GEOGREEN	Sementi	MICOU02	Micosat F Uno	gr.200	10.00	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
197c2c1d-146b-43cd-a8a2-35d18f0bfacb	GEOGREEN	Sementi	MICOTPWM01	Micosat F Tab Plus Wp Mini	gr.100	10.00	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
558adb1f-076b-42e8-b9f2-9f80a51ab6b4	GEOGREEN	Sementi	MICOLWM01	Micosat F Len Wp Mini	gr.100	10.00	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
7955100c-636c-4459-aca0-f10a26d374e5	GEOGREEN	Sementi	MICOMO5	Micosat F MO	5 kg	140.40	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
6d3539e8-10d6-420b-8aa1-8db59b9a5445	GEOGREEN	Sementi	METAGEGR1	Meta-Ge Granular	1 kg	24.90	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
fab83844-58fc-480c-9c06-9ed5f13cb850	GEOGREEN	Sementi	METAGE1	Meta-Ge	1 lt	71.80	\N	\N	\N	4.00	2026-02-18 18:28:51.815+00
85ffe656-4097-4daf-983a-f8b87a5c4055	GEOGREEN	Concimi	G7025	Green 7	25 kg	47.70	45.30	43.00	38.70	4.00	2026-02-18 18:28:51.815+00
1e5a2846-bad6-4fd6-98ed-5653ccdf75c4	GEOGREEN	Concimi	G8025	Albatros Green 8 Kg 25	25 kg	60.80	57.70	54.80	49.30	4.00	2026-02-18 18:28:51.815+00
2b08551d-dfaf-445c-b973-8cf92c5e1b44	GEOGREEN	Concimi	VA025	Albatros Vigor Active Kg 25	25 kg	53.10	50.40	47.90	43.00	4.00	2026-02-18 18:28:51.815+00
ac7950bc-d629-431f-bf6e-4a5a7d470a9c	GEOGREEN	Concimi	MGP010	Universal Top	20 kg	62.50	59.40	56.50	52.60	4.00	2026-02-18 18:28:51.815+00
08b2deb5-b3df-4c48-b6ff-95352ef11ef2	GEOGREEN	Concimi	MGP080	AllRound	20 kg	64.50	61.30	58.30	54.20	4.00	2026-02-18 18:28:51.815+00
0313e089-9430-432b-acce-d3d1ee03cceb	GEOGREEN	Concimi	MGE080	Pro Starter	20 kg	76.00	72.20	68.60	63.80	4.00	2026-02-18 18:28:51.815+00
4dc7f76b-6278-45fc-96f3-779a767d8064	GEOGREEN	Concimi	MGE110	Pro Slow	20 kg	75.00	71.30	67.80	63.00	4.00	2026-02-18 18:28:51.815+00
85165de1-edc5-4da7-b449-6a0984fb526e	GEOGREEN	Concimi	MGS010	Granustar	20 kg	74.00	70.30	66.80	62.20	4.00	2026-02-18 18:28:51.815+00
ec83f125-fff7-46b1-81e9-f77a2abd91d0	GEOGREEN	Concimi	MGR040	Iron Power	20 kg	68.70	65.30	62.00	57.70	4.00	2026-02-18 18:28:51.815+00
0455aac5-bd6a-477d-b174-9fd635e6c99f	GEOGREEN	Concimi	PAL001	Alga Park 1Kg	1 kg	38.70	32.90	29.60	\N	4.00	2026-02-18 18:28:51.815+00
f7c9f620-1b6a-4bc9-94b3-669b9b96cc21	GEOGREEN	Concimi	PAL005	Alga Park 5Kg	5 kg	165.10	140.00	126.00	\N	4.00	2026-02-18 18:28:51.815+00
a403f960-84d7-4b0e-8bb3-d6a61407953c	GEOGREEN	Concimi	PAM001	Amino K 1 Kg	1 kg	17.60	15.00	13.50	\N	4.00	2026-02-18 18:28:51.815+00
b576cd19-6b07-40cb-9290-d27d483cc346	GEOGREEN	Concimi	PAM005	Amino K 5 Kg	5 kg	66.80	56.80	51.00	\N	4.00	2026-02-18 18:28:51.815+00
25a3d4d3-c709-4dd3-8b1b-592a970e783d	GEOGREEN	Concimi	PAM025	Amino K 25 Kg	25 kg	264.00	224.00	200.00	\N	4.00	2026-02-18 18:28:51.815+00
1da91236-8022-41cd-ba5d-6c3c425c8f24	GEOGREEN	Concimi	PFE001	Fe Ulk 1 Kg	1 kg	32.30	27.40	24.70	\N	4.00	2026-02-18 18:28:51.815+00
a6d3811b-f859-4fb6-8522-14c05064ea3a	GEOGREEN	Concimi	PFE010	Fe Ulk 10 Kg	10 kg	238.00	200.00	180.00	\N	4.00	2026-02-18 18:28:51.815+00
b41c94ba-6a8c-4dc1-9ca8-5dda81de7207	GEOGREEN	Concimi	TNK005	NPK Enduring 5 kg	5 kg	48.10	41.00	36.90	\N	4.00	2026-02-18 18:28:51.815+00
a50b2d72-14e0-4fba-ba77-2c03da8fdcc7	GEOGREEN	Concimi	PLK005	Leokare 5 kg	5 kg	72.60	62.00	55.80	\N	4.00	2026-02-18 18:28:51.815+00
254d69fb-9629-422b-8944-5d01827a35f8	GEOGREEN	Concimi	PSK001	Sevenkare 1 kg	1 kg	20.60	17.50	15.70	\N	4.00	2026-02-18 18:28:51.815+00
48f134ef-8900-4fdc-a79b-2576e8ccd51c	GEOGREEN	Concimi	PHU005	Humifitos 5 Kg	5 kg	40.30	34.20	30.80	\N	4.00	2026-02-18 18:28:51.815+00
ad980c68-737e-4404-a263-becb6f5612a2	GEOGREEN	Concimi	PHU025	Humifitos 25 Kg	25 kg	135.20	115.00	103.00	\N	4.00	2026-02-18 18:28:51.815+00
2afa42d8-6650-4e99-8175-e8155fefa993	GEOGREEN	Concimi	PRO005	Root Speed 5 Kg	5 kg	57.80	49.00	44.10	\N	4.00	2026-02-18 18:28:51.815+00
d7585e76-741f-4b80-9708-7be3127727a7	GEOGREEN	Concimi	PDV001	Decal Vyro 1 Kg	1 kg	13.40	11.40	10.30	\N	4.00	2026-02-18 18:28:51.815+00
f27c4bf1-6c54-4c2d-b774-6262daecc160	GEOGREEN	Concimi	PATU005	Paint Turf	0,5 kg	73.80	\N	\N	\N	22.00	2026-02-18 18:28:51.815+00
7c77afbd-22a3-456e-ab8f-5898eb398112	GEOGREEN	Concimi	WETU01	Wet Turf	LT.1	73.20	65.90	62.60	\N	22.00	2026-02-18 18:28:51.815+00
f04779b8-71c3-48a5-a77b-c663c806be48	GEOGREEN	Concimi	WETU05	Wet Turf	LT.5	256.20	230.60	219.00	\N	22.00	2026-02-18 18:28:51.815+00
fcafd86c-bd66-4f70-a265-787ea45ea83e	GEOGREEN	Concimi	ED7C05	Eden 7	5 kg	15.70	14.90	14.20	\N	4.00	2026-02-18 18:28:51.815+00
30d39e04-c269-4df8-9beb-3e315bc9c5f8	GEOGREEN	Concimi	ED8C05	Eden 8	5 kg	18.20	17.30	16.50	\N	4.00	2026-02-18 18:28:51.815+00
2347e6c8-ee0c-4d13-8f58-618462974fac	GEOGREEN	Concimi	EMUC05	Eden Multi	3,5 kg	19.00	18.10	17.20	\N	4.00	2026-02-18 18:28:51.815+00
b700692c-0682-4caf-82c0-5888522e67e5	GEOGREEN	Concimi	VAC05	Vigor Active	5 kg	14.50	13.80	13.10	\N	4.00	2026-02-18 18:28:51.815+00
5b0a1434-a75f-4c45-a425-d1442c37a26d	GEOGREEN	Concimi	EIN01	Sustenium Eden Integramix	0,25 kg	8.00	7.60	7.20	\N	4.00	2026-02-18 18:28:51.815+00
8b97755b-907a-4bca-add7-361b05973089	GEOGREEN	Concimi	EPR01	Sustenium Eden Prevent	0,25 kg	8.50	8.10	7.70	\N	4.00	2026-02-18 18:28:51.815+00
3597e0d2-a86b-41f7-b61b-b67616657d6f	GEOGREEN	Concimi	EFO01	Sustenium Eden Force	0,5 kg	13.00	12.30	11.70	\N	4.00	2026-02-18 18:28:51.815+00
f2555569-f829-4c09-a878-4555aab1a65c	GEOGREEN	Concimi	ENB01	Sustenium Eden Nutribio	0,25 kg	10.00	9.50	9.00	\N	4.00	2026-02-18 18:28:51.815+00
acfddc0f-7081-423d-a6d2-bd7856aa8982	GEOGREEN	Concimi	EFB01	Sustenium Eden Ferro G Bio	0,25 kg	13.00	11.40	10.80	\N	4.00	2026-02-18 18:28:51.815+00
1d7f06d1-bc90-4a32-9b8a-4d4d98225d4f	STIHL	Motoseghe batteria	MA03-200-0021	MSA 220.0 C-B 16"	\N	470.00	499.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
88a42f46-bce8-427f-ad24-b9af333feed3	STIHL	Motoseghe batteria	MA03-200-0027	MSA 220.0 C-B Catena DURO 3 14"	\N	490.00	529.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
2dee7204-d30d-48c5-a5ae-5fc9164c941a	STIHL	Motoseghe elettriche	1208-200-0304	MSE 141 C-Q 30cm/12"	\N	180.00	194.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
bb0cf5f2-720e-4ba0-8eac-a8f41ce474d4	STIHL	Motoseghe elettriche	1208-200-0332	MSE 141 C-Q 35cm/14"	\N	190.00	204.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
ad078f16-46a9-4352-8218-116b5fced578	STIHL	Motoseghe elettriche	1209-200-0154	MSE 170 C-Q 30cm/12"	\N	270.00	289.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c7670188-5ded-48fb-9487-d811906240f2	STIHL	Motoseghe elettriche	1209-200-0155	MSE 170 C-Q 35cm/14"	\N	280.00	299.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
70f74bec-fc11-4919-9c19-135a3a2b5a24	STIHL	Motoseghe elettriche	1209-200-0157	MSE 190 C-Q 35cm/14"	\N	320.00	339.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
23fee55a-f4a9-483b-b84e-969c23c9e6e9	STIHL	Motoseghe elettriche	1209-200-0180	MSE 190 C-Q 40cm/16"	\N	330.00	349.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b96fa3b8-95e6-4381-af03-1f72f196cfc2	STIHL	Motoseghe elettriche	1209-200-0160	MSE 210 C-BQ 35cm/14"	\N	380.00	404.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
16d3ff30-0ec3-4db4-820b-d10cdd741aad	STIHL	Motoseghe elettriche	1209-200-0179	MSE 210 C-BQ 40cm/16"	\N	390.00	413.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3b147675-efb0-4be9-9974-7d3167aa7ad3	STIHL	Motoseghe scoppio	1148-200-0002	MS 162 61PMM3	\N	199.00	198.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
01e11135-11d8-4cc2-ad88-5cd7d716246a	STIHL	Motoseghe scoppio	1148-200-0003	MS 162 C-BE 61PMM3	\N	240.00	239.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4ac75258-027e-4e87-9110-4f8396138c71	STIHL	Motoseghe scoppio	1148-200-0011	MS 172 35cm/14"	\N	270.00	299.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
f3496ae4-192d-4d12-8b63-18a8a79542da	STIHL	Motoseghe scoppio	1148-200-0014	MS 172 40cm/16"	\N	280.00	309.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d7554292-4494-4af7-b4bf-cabfb9f585b8	STIHL	Motoseghe scoppio	1148-200-0033	MS 172 C-BE 35cm/14"	\N	320.00	339.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9f00a4c2-cce7-4280-87b3-6c48aff017ad	STIHL	Motoseghe scoppio	1148-200-0035	MS 172 C-BE 40cm/16"	\N	330.00	349.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
de187a3a-0120-4000-9795-c591955d9488	STIHL	Motoseghe scoppio	1148-200-0064	MS 182 40cm/16"	\N	370.00	409.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
381be0fd-a7d5-46e6-9b12-d8518da1f08d	STIHL	Motoseghe scoppio	1148-200-0104	MS 182 C-BE 40cm/16"	\N	420.00	449.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
28359ffb-b6db-4706-95a6-4a70190d7a16	STIHL	Motoseghe scoppio	1146-200-0056	MS 151 TC-E 1/4" 25cm	\N	420.00	559.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5017db1f-c131-42cd-ad6e-7a923470dd59	STIHL	Motoseghe scoppio	1146-200-0057	MS 151 TC-E 1/4" 30cm	\N	430.00	569.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e51c8ef2-3f8e-4f4b-802c-b915619f3146	STIHL	Motoseghe scoppio	1146-200-0071	MS 151 TC-E ErgoStart 1/4" 30cm	\N	560.00	619.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
74bd2bf4-d29c-434a-b221-5634eb361242	STIHL	Motoseghe scoppio	1146-200-0054	MS 151 C-E 1/4" 25cm	\N	510.00	569.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
37727bf2-21c3-478d-9a30-33f76a20d2a2	STIHL	Motoseghe scoppio	1146-200-0055	MS 151 C-E 1/4" 30cm	\N	520.00	579.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
45107677-6f37-4c0c-8930-d55f3bfae265	STIHL	Motoseghe scoppio	1146-200-0059	MS 151 C-E 1/4" ErgoStart	\N	570.00	629.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e7285df9-b3d8-4a4d-9258-f4eecb732bf3	STIHL	Motoseghe scoppio	1137-200-0312	MS 194 T 1/4" 35cm/14"	\N	370.00	489.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7de680ae-c3b7-4ff8-a17d-0b83d871578e	STIHL	Motoseghe scoppio	1137-200-0314	MS 194 T 1/4" 30cm/12"	\N	360.00	479.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0b971f3f-ccc5-42e9-a469-29b2ce043ea8	STIHL	Motoseghe scoppio	1137-200-0322	MS 194 T 3/8" 30cm/12"	\N	360.00	479.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b4511b64-797c-48bd-8e57-89a67203491f	STIHL	Motoseghe scoppio	1137-200-0323	MS 194 T 3/8" 35cm/14"	\N	370.00	489.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
2d4a0f99-995c-4d4d-9073-0680a042f624	STIHL	Motoseghe scoppio	1137-200-0324	MS 194 TC-E 3/8" ErgoStart	\N	460.00	509.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
58279c22-02c1-4c58-8ec0-37b5eda01925	STIHL	Motoseghe scoppio	1137-200-0332	MS 194 C-E 30cm/12"	\N	450.00	499.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6aa71b33-8644-4e82-b234-eb6d8faeb779	STIHL	Motoseghe scoppio	1137-200-0334	MS 194 C-E 1/4" ErgoStart	\N	490.00	549.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4a0a6a9d-78da-45eb-a940-70b0531adedc	STIHL	Motoseghe scoppio	1137-200-0340	MS 194 T 1/4" Carving 30cm	\N	480.00	533.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4d758d05-93e8-410b-9141-916add41472d	STIHL	Motoseghe scoppio	1137-200-0370	MS 194 TC-E 35cm/14"	\N	470.00	519.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3f9470a5-5dd2-4acc-a8cc-4500650dda4d	STIHL	Motoseghe scoppio	1145-200-0263	MS 201 C-M 3/8" 14"	\N	890.00	989.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9f77df35-28fd-4478-919d-1d1e4b3139d2	STIHL	Motoseghe scoppio	1145-200-0264	MS 201 C-M 3/8" 16"	\N	900.00	999.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4e3d6798-1886-45cf-b94e-0764f6335863	STIHL	Motoseghe scoppio	1145-200-0267	MS 201 TC-M 3/8" 14"	\N	900.00	1049.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
751dbe31-a212-4c16-8ebc-8750a3bc35ce	STIHL	Motoseghe scoppio	1145-200-0270	MS 201 TC-M 3/8" 12"	\N	890.00	1039.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
33412448-c2a1-4519-abaf-cfc87111b28a	STIHL	Motoseghe scoppio	1148-200-0139	MS 212 35cm/14"	\N	440.00	489.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
28ca47a9-ffde-4757-b9bd-73fa876e761d	STIHL	Motoseghe scoppio	1148-200-0144	MS 212 40cm/16"	\N	450.00	499.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c05673c4-62c3-44e1-b61f-01be48d34866	STIHL	Motoseghe scoppio	1148-200-0179	MS 212 C-BE 35cm/14"	\N	480.00	529.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
352f1eac-247f-4c77-bf4c-533b880a6030	STIHL	Motoseghe scoppio	1148-200-0184	MS 212 C-BE 40cm/16"	\N	490.00	539.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
934606b7-7c6c-4b46-9a2c-ec8823d27be9	STIHL	Motoseghe scoppio	1143-200-0684	MS 231 40cm/16"	\N	510.00	589.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
947e5fd1-d7a6-4380-ab8b-c9164dac6a66	STIHL	Motoseghe scoppio	1143-200-0688	MS 231 C-BE 40cm/16"	\N	550.00	629.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0a8eb3f9-ee5f-477f-8323-2959c8052f67	STIHL	Motoseghe scoppio	1143-200-0721	MS 231 45cm/18"	\N	520.00	599.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
ec9d0394-ec9b-4265-bba0-257d1ac3587e	STIHL	Motoseghe scoppio	1143-200-0722	MS 231 C-BE 45cm/18"	\N	550.00	634.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
faa302db-dbea-4b01-80e3-6796f93d68a6	STIHL	Motoseghe scoppio	1143-200-0683	MS 251 40cm/16"	\N	570.00	659.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0f6fd4c0-b2e0-4f89-aa77-09e03f04c46a	STIHL	Motoseghe scoppio	1143-200-0686	MS 251 C-BE 40cm/16"	\N	630.00	729.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
543e50cc-ae85-4cc1-8c57-01e582380d40	STIHL	Motoseghe scoppio	1143-200-0719	MS 251 45cm/18"	\N	580.00	669.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
ce8425d7-07cf-4518-be1b-618d96b242da	STIHL	Motoseghe scoppio	1143-200-0720	MS 251 C-BE 45cm/18"	\N	640.00	739.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7d3d8a91-33f8-48cb-adcb-8848f2eead11	STIHL	Motoseghe scoppio	1141-200-0647	MS 261 C-M 40cm/16"	\N	1000.00	1159.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3d5b21f1-ae1f-4b03-8595-ab59373c1066	STIHL	Motoseghe scoppio	1141-200-0649	MS 261 C-BM 40cm/16"	\N	1030.00	1189.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
8713546c-5b4d-456e-a26f-3206b45491d5	STIHL	Motoseghe scoppio	1141-200-0651	MS 261 C-M VW 40cm/16"	\N	1100.00	1279.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
39584c88-756b-4dd5-a1c8-ea6ffaaf8da3	STIHL	Motoseghe scoppio	1141-200-0652	MS 261 C-M 45cm/18"	\N	990.00	1169.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6b11e0e5-0fbd-4560-b102-bc9ab2a741ce	STIHL	Motoseghe scoppio	1141-200-0665	MS 261 C-BM 45cm/18"	\N	1040.00	1199.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3c5fbc6b-75f5-443b-bfb8-1102eaad335e	STIHL	Motoseghe scoppio	1141-200-0645	MS 271 40cm/16"	\N	690.00	799.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4ce2bd9f-a85f-443f-a500-61c9baf301f9	STIHL	Motoseghe scoppio	1141-200-0660	MS 271 45cm/18"	\N	700.00	808.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
db55e21f-0ebb-48e8-bc85-1a85cd27212a	STIHL	Motoseghe scoppio	1141-200-0687	MS 291 40cm/16"	\N	740.00	849.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7935738d-d21d-4609-a66e-4ba200ca69dd	STIHL	Motoseghe scoppio	1141-200-0690	MS 291 45cm/18"	\N	750.00	859.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9d42bb73-2ca3-4a4d-a2fc-6d151d9f837b	STIHL	Motoseghe scoppio	1140-200-0777	MS 311 50cm/20"	\N	850.00	949.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6675129e-6d24-446a-aa46-59d2c8c3b26e	STIHL	Motoseghe scoppio	1140-200-0741	MS 391 50cm/20"	\N	910.00	1019.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4b410123-8e05-4d29-8577-51afcee01cf1	STIHL	Motoseghe scoppio	MB01-200-0008	MS 400.1 C-M 50cm/20"	\N	1360.00	1519.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
80730d0e-1800-4f3a-b26c-d6363d09739c	STIHL	Motoseghe scoppio	1142-200-0032	MS 462 C-M 50cm/20"	\N	1400.00	1659.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
8541e25a-1cfa-4425-9491-c6e858ef1c92	STIHL	Motoseghe scoppio	1142-200-0033	MS 462 C-M 63cm/25"	\N	1430.00	1679.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
f79b428c-b9a5-4e7e-b223-ca783849eb21	STIHL	Motoseghe scoppio	1147-200-0000	MS 500i 3/8" 50cm/20"	\N	1700.00	1998.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
987c8d8e-581e-4308-b7a7-3589908c1076	STIHL	Motoseghe scoppio	1147-200-0001	MS 500i 3/8" 63cm/25"	\N	1720.00	2019.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3c640d95-86c6-436a-8749-986ad201cf34	STIHL	Motoseghe scoppio	1144-200-0319	MS 661 C-M 71cm/28"	\N	1630.00	1899.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c64ce5ae-7961-4073-8b08-10dbaee8ebe2	STIHL	Motoseghe scoppio	1144-200-0322	MS 661 C-M 63cm/25"	\N	1600.00	1879.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e97e9304-35f2-4953-8c74-0f18a7d92297	STIHL	Motoseghe scoppio	1124-200-0204	MS 881 90cm/36"	\N	1990.00	2329.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5063dc48-5235-4ebb-a00d-73b41a90484c	STIHL	Motoseghe scoppio	1124-200-0206	MS 881 105cm/41"	\N	2020.00	2369.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
cc203da5-5782-43bd-9920-2012f40325c4	GGP	Rasaerba	00-105	RASAERBA XP 40 ELETTRICA SPINTA 38cm	\N	175.00	160.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
ecbf452e-f7bb-47e8-8a57-38696423bef6	GGP	Rasaerba	00-196	RASAERBA XC 43 SPINTA 41cm	\N	285.00	270.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
8218b9c1-4c2d-4f6b-93f6-d18aa2b41fe9	GGP	Rasaerba	00-210	RASAERBA XC 48 SPINTA 46cm	\N	310.00	290.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
805aa796-a92c-41ae-8236-5a828349da58	GGP	Trattorini	00-1338	RIDER STIGA COMBI 166 HD HIDRO 66cm	\N	1900.00	1800.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
adbe205b-f592-40f4-b5ab-8700013dac73	GGP	Trattorini	00-1673	RIDER GGP XF 135 HD - STIGA HIDRO 72cm	\N	2300.00	2200.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5c8713ce-5ad6-46a2-8ba5-b25d6c2028a6	GGP	Trattorini	00-1880	TRATT. GGP XDC 150 HD HIDRO 84cm	\N	2700.00	2600.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6b847015-3c1e-4af8-9ffc-637ee464bd1e	GGP	Trattorini	00-2585	TRATT. GGP XDC 180 HD HIDRO 98cm	\N	3500.00	3400.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
45884dea-726e-414c-b0d7-9ad1b1665388	GGP	Trattorini	00-3150	TRATT. GGP PTX 210 HD HIDRO 102cm	\N	4300.00	4200.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
a8e36cfa-bb44-4c8a-920d-2da67ee63ec8	GGP	Accessori	KIT-MUL-TAPPO	KIT MULCHING SOLO TAPPO 72/84/92/102/122cm	\N	85.00	80.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6471d9a1-c816-47b7-9893-fb3d23dc6398	GGP	Accessori	KIT-MUL-LAME	KIT MULCHING LAME + TAPPO 72/84/92/102/122cm	\N	130.00	125.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d3902f43-6ea5-4bf1-9fac-69a6becc2db8	GGP	Accessori	KIT-PARAS	KIT PARASASSI 84/92/102/122cm	\N	140.00	140.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
4730e43d-48b1-42f5-90d1-254d9f531bf9	GGP	Accessori	KIT-TRAINO-GGP	KIT TRAINO GGP	\N	65.00	60.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e4d7a112-bf02-4115-bc94-f6729290d1c3	GGP	Trattorini	00-1610	TRATT. GGP XD 150 HD HIDRO 98cm	\N	2300.00	2200.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
452207ce-d73d-4a63-b939-f78ad2be540d	GGP	Trattorini	00-2280	TRATT. GGP XDL 210 HD HIDRO 108cm	\N	3100.00	3000.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
32c5b3f2-6a5f-4f2c-8211-ce04248973dd	GGP	Accessori	000-44	TAPPO MULCHING 98/108	\N	60.00	60.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0172c645-7ddf-4329-8a25-1e277384bf06	GGP	Trattorini	00-4180	TRATT. STIGA PARK 500 W HIDRO 100cm	\N	5300.00	5200.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e88d1fb5-055f-4734-90a9-58147ebe1e81	GGP	Accessori	00-255	RIMORCHIO LDC1002 102x76cm	\N	400.00	380.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0dd323ba-40e2-4932-afda-ba0d7971d2d2	GGP	Accessori	00-330	RIMORCHIO LC 1500B 122x87cm	\N	500.00	480.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6b0e5169-9bc2-428f-8929-6de4c9fe19c9	WORX	Soffiatori	WG505E	SOFF. ASP. WG 505E 220V 3000W	\N	120.00	110.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
272a856f-8341-4bb8-b8ba-b2a7bbe3481b	WORX	Soffiatori	WG547E	SOFFIATORE WG 547E 1 BATT.2Ah	\N	139.00	130.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
eebf67df-a56c-4088-b4bc-cef5908a052f	WORX	Soffiatori	WG543E	SOFFIATORE WG 543E 1 BATT.4Ah	\N	210.00	200.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b0cf8e35-16bd-4c0c-97f6-1bef8173d496	WORX	Varie	WG894.9E	SEGHETTO A GATTUCCIO WG894.9E	\N	85.00	79.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
35ddc93f-0849-4057-81b7-93930493601f	WORX	Forbici/Potatori	WG330E	FORBICE WG330E 1 BATT.2Ah + CARICA	\N	190.00	180.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7037f63c-c97a-4936-bf8e-16333913f218	WORX	Forbici/Potatori	WG325E	POTATORE A CATENA WG325E 1 BATT.2Ah + CARICA 20cm	\N	190.00	180.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d14fd724-538b-4de7-b660-4e562f01393a	WORX	Forbici/Potatori	WG349E	POTATORE AD ASTA WG349E 1 BATT.2Ah + CARICA	\N	190.00	180.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
38d4e6e6-1850-481d-ac5e-889628fc5cee	WORX	Tagliasiepi	WG252E	TAGLIASIEPE TELES. WG252E 1 BATT.2Ah + CARICA 45cm	\N	180.00	170.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
67bffdd2-4d39-4d45-b1b4-345517494c17	WORX	Varie	WX352	TRAPANO AVVITATORE WX352 2 BATT.2Ah + CARICA	\N	235.00	230.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
901cf94a-e7be-4836-87f9-4ccdbebc6c56	WORX	Varie	WX352.9	TRAPANO AVVITATORE WX352.9	\N	140.00	130.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
78d4e26f-2a18-4179-b7ea-5580698398e5	WORX	Varie	HIDROSHOT	LANCIA PRESSIONE HIDROSHOT	\N	160.00	150.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e0f690db-11f5-4763-a207-5519355b5a2f	WORX	Tagliasiepi	WG264E	TAGLIASIEPI WG264E 1 BATT.2Ah	\N	180.00	170.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6711e00d-9405-481e-93d0-395eac18fc17	WORX	Trimmer	WG119E	TRIMMER ELETTRICO WG 119E 220V 550W	\N	85.00	80.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c95cb1da-c019-414a-88cf-31b828b518be	WORX	Trimmer	WG157E	TRIMMER WG157E 1 BATT.2Ah 30 MIN.	\N	110.00	100.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
395ce432-41a8-4c39-9d64-70b5c8e01640	WORX	Trimmer	WG163E	TRIMMER WG163E 2 BATT.2Ah 60 MIN.	\N	150.00	140.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7a7484c6-4aea-4e83-b41d-3159d53dea5b	WORX	Accessori	KIT-POWER20	KIT POWER 20 (1 BATT.2ah - 1 carica)	\N	75.00	70.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
390c09b7-a8e1-4351-9209-ac66222f04db	WORX	Accessori	BATT-2AH-20V	BATTERIA 2ah 20V	\N	50.00	45.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
852f460c-1d57-42ba-ac90-914e4856fb16	WORX	Accessori	BATT-4AH-20V	BATTERIA 4ah 20V	\N	80.00	75.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9d5af1aa-c804-4643-b480-65b9ea29d64a	HONDA	Robot rasaerba	HRM-1000E	HRM 1000 E NEW - 1000 m/q	1000 m/q	799.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
05a399ac-17d3-4b70-a0af-17e6f3407f8b	STIHL	Motoseghe batteria	MA04-011-5800	MSA 60.0 C-B 1/4"P	\N	199.00	198.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9d6e9199-0631-4ce9-8129-f201a9c4a751	STIHL	Motoseghe batteria	MA04-011-5806	MSA 60.0 C-B 1/4"P SET BATTERIA/CARICA	\N	339.00	339.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
843fce65-22fb-48f3-93b9-4223fc7110b3	STIHL	Motoseghe batteria	MA04-011-5816	MSA 70.0 C-B 1/4"P	\N	239.00	239.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
559d95ad-058b-40fd-b3ad-c69f15b4b2d0	STIHL	Motoseghe batteria	MA04-011-5822	MSA 70.0 C-B 1/4"P SET BATTERIA/CARICA	\N	409.00	409.01	\N	\N	22.00	2026-02-19 06:37:50.080804+00
2c28ca0e-53b5-47b7-810f-f1a1f7e2a9dc	STIHL	Motoseghe batteria	MA04-011-5843	MSA 80.0 C-B 1/4"P	\N	389.00	389.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
cc4f3cf1-d9e4-4fce-a053-7218288d8986	STIHL	Motoseghe batteria	MA04-011-5832	MSA 80.0 C-B 1/4"P SET BATTERIA/CARICA	\N	559.00	559.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
a65937b3-eb1d-4988-ada1-6bf406bef640	STIHL	Motoseghe batteria	MA03-200-0004	MSA 160.0 C-B Doppia impugnatura 12"	\N	350.00	369.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
02f0e5ed-335f-415d-8d59-d99884d0d206	STIHL	Motoseghe batteria	1252-200-0043	MSA 161 T 25cm/10"	\N	400.00	439.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9cdc0607-5ae8-476c-8180-a3ee9fea71ee	STIHL	Motoseghe batteria	1252-200-0044	MSA 161 T 30cm/12"	\N	410.00	449.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
1268b1fc-4a2b-453e-99d6-95f687749c15	STIHL	Motoseghe batteria	MA05-200-0000	MSA 190.0 T 30cm/12"	\N	350.00	369.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
8e252893-211c-438a-85d1-2a3676eedaed	STIHL	Motoseghe batteria	MA03-200-0010	MSA 200.0 C-B	\N	430.00	459.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c9f510b2-b256-44f1-bcf9-c7a0ade37cd7	STIHL	Motoseghe batteria	MA01-200-0002	MSA 220.0 TC-O Livello olio 12"	\N	770.00	808.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c64b0ffb-8426-41d1-aec2-d7b80b02441c	STIHL	Motoseghe batteria	MA01-200-0003	MSA 220.0 TC-O Livello olio 14"	\N	780.00	819.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3b79eae3-074c-47eb-99da-28109d2361fe	STIHL	Motoseghe batteria	MA01-200-0021	MSA 220.0 T 12"	\N	560.00	748.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
2b5db09f-1b65-4c70-88c8-30300a65549b	STIHL	Motoseghe batteria	MA01-200-0022	MSA 220.0 T 14"	\N	570.00	759.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
767a38e7-edaa-4bf8-ac05-44e3b9b69e38	STIHL	Motoseghe batteria	MA02-200-0004	MSA 300.0 40cm/16"	\N	760.00	798.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d3f03714-1b75-4259-80e7-1c6fca6bd9b3	STIHL	Motoseghe batteria	MA02-200-0007	MSA 300.0 45cm/18"	\N	770.00	808.99	\N	\N	22.00	2026-02-19 06:37:50.080804+00
7b007cb9-080a-4b4a-8e85-7207e712016e	STIHL	Motoseghe batteria	MA02-200-0082	MSA 300.1 C-O Livello olio 16"	\N	850.00	939.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
9102f8c1-bd9f-44da-b73c-c5b5b5f8f4a4	STIHL	Motoseghe batteria	MA02-200-0092	MSA 300.1 C-O Livello olio 18"	\N	860.00	949.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5c08f4cd-3d84-4ee9-8d5a-4fb2d08897e8	STIHL	Motoseghe batteria	MA03-200-0020	MSA 220.0 C-B 14"	\N	460.00	489.00	\N	\N	22.00	2026-02-19 06:37:50.080804+00
84cf4b00-3db3-40e8-9b0e-c69d804626bc	SEGWAY	Accessori robot	754860	KIT SENSORI ULTRASUONI Navimow	\N	190.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
934b6c14-9f5d-465a-a59f-1030ca1b967a	SEGWAY	Accessori robot	755200	GARAGE S Navimow	\N	150.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
f4b79426-5fcb-4d6a-92d8-5780edd2a866	SEGWAY	Accessori robot	755210	GARAGE M Navimow	\N	200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
edf0e82c-e762-4755-ae05-717fc8d4c18f	SEGWAY	Accessori robot	755310	GARAGE L X3 Navimow	\N	250.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
dd2c6b9f-9b54-460c-808d-8e0d686d4920	SEGWAY	Accessori robot	755390	KIT TRIMMER X3 Navimow	\N	300.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
72d28fc8-cdaa-48f4-85e5-90cf172a049f	SEGWAY	Robot rasaerba	NAVI-108J	NAVIMOW 108 J + kit 4G 800 m/q	800 m/q	1000.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
fa1ddd3e-dfb6-4623-8c59-f2cffe2e7083	SEGWAY	Robot rasaerba	NAVI-H1500E	NAVIMOW H1500E + Vision Fance 1500 m/q	1500 m/q	1900.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
beaeb6c7-d08e-4325-9c1c-a6f463e89339	SEGWAY	Robot rasaerba	NAVI-H206E	NAVIMOW H 206E 600 m/q	600 m/q	1700.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e26d9b89-8956-46a4-a1eb-55959f71e35e	SEGWAY	Robot rasaerba	NAVI-H210E	NAVIMOW H 210E 1000 m/q	1000 m/q	1900.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
1d1cb9e0-6c1a-4ac0-b4aa-404706ab0657	SEGWAY	Robot rasaerba	NAVI-H215E	NAVIMOW H 215E 1500 m/q	1500 m/q	2200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d4c25416-7d19-4278-b15b-1ddfabb08225	SEGWAY	Robot rasaerba	NAVI-H230E	NAVIMOW H 230E 3000 m/q	3000 m/q	2600.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c77f8244-b45c-4703-a6f1-28809091b50a	SEGWAY	Robot rasaerba	NAVI-I210	NAVIMOW I210 AWD 1000 m/q	1000 m/q	1200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
2cd0cfde-3cc0-4805-8185-51d5f3b57705	SEGWAY	Robot rasaerba	NAVI-X3-315E	NAVIMOW X3 - 315E 1500 m/q	1500 m/q	2300.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
fa363801-c635-44f2-9d2e-ed9ba86b3e84	SEGWAY	Robot rasaerba	NAVI-X3-330E	NAVIMOW X3 - 330E 3000 m/q	3000 m/q	2800.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b8897d04-3734-4f38-b898-f59e3419c9e6	SEGWAY	Robot rasaerba	NAVI-X3-350E	NAVIMOW X3 - 350E 5000 m/q	5000 m/q	3300.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
d594cd18-f5f1-4fee-827a-5b2f28e19586	SEGWAY	Robot rasaerba	NAVI-X3-390E	NAVIMOW X3 - 390E 10000 m/q	10000 m/q	4200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
fd58c1f6-5815-4576-8ac0-a785d83923dd	SEGWAY	Robot rasaerba	NAVI-X420E	NAVIMOW X420E AWD 2000 m/q	2000 m/q	2500.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b3b11fb1-9dc3-4274-abbd-3201a5b9a499	HONDA	Robot rasaerba	HRM-1500	HRM 1500 NEW - 1500 m/q	1500 m/q	1300.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
fbd40c65-9c84-4190-bf0d-101b495f4ec7	HONDA	Robot rasaerba	HRM-2500	HRM 2500 NEW - 2500 m/q	2500 m/q	2200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
eb80ab90-57c3-4fa0-a67b-fbe0e01ffcca	HONDA	Robot rasaerba	HRM-1500EC	HRM 1500 EC NEW - 1500 m/q	1500 m/q	1700.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e423d098-a39f-48d8-affd-5a03ce0b9db6	HONDA	Robot rasaerba	HRM-2500EC	HRM 2500 EC NEW - 2500 m/q	2500 m/q	2560.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
17f7308d-dcd4-4cfb-8ac1-f27f82c45524	HONDA	Robot rasaerba	HRM-4000EC	HRM 4000 EC NEW - 4000 m/q	4000 m/q	3100.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c0a6754a-615c-4c6d-8ce9-07a25c89d108	SEGWAY	Accessori robot	754840	KIT ESTENSIONE ANTENNA Navimow	\N	50.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
6e789e45-d1b7-46dd-aa3d-a52a4020adea	SEGWAY	Accessori robot	754880	PROLUNGA CAVO ANTENNA Navimow	\N	30.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
cd49c94e-6eee-4371-a643-81cff6f21b81	SEGWAY	Accessori robot	754920	KIT VISION FANCE Navimow	\N	290.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5f1b3b0e-7a1b-4c55-9db9-5854f63a5e1d	SEGWAY	Robot rasaerba	NAVI-TERRANOX120	NAVIMOW TERRANOX CM 120 M1 AWD 12000 m/q	12000 m/q	5500.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b22254bf-9213-4fa5-ba9f-78229afe313a	SEGWAY	Robot rasaerba	NAVI-TERRANOX240	NAVIMOW TERRANOX CM 240 M1 AWD 24000 m/q	24000 m/q	7000.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
f0fb6b0a-2676-4ff5-86a3-5e1b4d0443bb	SEGWAY	Robot rasaerba	NAVI-X430E	NAVIMOW X430E AWD 3000 m/q	3000 m/q	2800.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
75891c33-22d5-4f0a-9ed0-72da67082ff9	SEGWAY	Robot rasaerba	NAVI-X450E	NAVIMOW X450E AWD 5000 m/q	5000 m/q	3200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
1ac3b85a-b8cf-43bb-90cd-2f940e77cfad	STIHL	Robot rasaerba	RMI-422	iMOW RMI 422 800 m/q 20cm	800 m/q	700.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e6f281b9-7f4d-4c39-8668-7416528afd52	STIHL	Robot rasaerba	IMOW-5	iMOW 5 1500 m/q 28cm	1500 m/q	1750.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b2968950-260a-4d97-b750-41954d9b447d	STIHL	Accessori robot	IMOW-TETTUCCIO	TETTUCCIO PARASOLE RIBALTABILE iMOW	\N	180.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
c12e0808-724e-4ae2-bf85-e56209efa3ae	WORX	Robot rasaerba	WR147E1	ROBOT LANDROID WR 147E1 L 1000 m/q 18cm	1000 m/q	890.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
b4ae9692-524e-4f1b-8d04-ca8210edb79c	WORX	Accessori robot	KIT-RUOTE-141	KIT RUOTE APPESANTITE X 141/165/167	\N	90.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
bfdbd2e1-021c-4411-b23d-dad68f60760d	WORX	Accessori robot	KIT-RUOTE-148	KIT RUOTE APPESANTITE X 148/147/155	\N	130.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
0b7f4723-3bcf-4cdd-a851-24c8bcfb8fb3	WORX	Accessori robot	KIT-USS-ACS	KIT SENSORI ULTRASUONI ACS	\N	240.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3094469b-545d-4122-acc7-f418fa542ad6	WORX	Accessori robot	CAPPOTTINA	CAPPOTTINA APRIBILE Landroid	\N	190.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
bf76ef23-3231-4e3b-ae16-b2744b5e3f50	WORX	Accessori robot	KIT-BASE-141	KIT BASE RICARICA X 141/167/148/167	\N	210.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
30eea30c-58d3-457b-9f1d-fd72605fff63	WORX	Accessori robot	KIT-BASE-143	KIT BASE RICARICA X 143/147/155	\N	230.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
640afbdf-ef01-4bbe-ba5a-d5d5135f2e9b	WORX	Accessori robot	BATT-20V-4AH-PRO	BATTERIA 20V 4.0 Ah PRO Landroid	\N	85.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
5b05c3e8-c759-445b-a84c-1793876f4d61	SEGWAY	Robot rasaerba	YARBO-RASAERBA	YARBO + MODULO RASAERBA X 25.000 m/q 50cm	25000 m/q	7200.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
3b0fe470-a071-4be5-bf19-aed9b02f55db	SEGWAY	Accessori robot	755320	KIT ESTENSIONE ANTENNA 10 MT. X3	\N	30.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
71d8146a-18ed-4676-a93d-a6424db000d2	SEGWAY	Accessori robot	755330	ADATTATORE TRASFORMATORE ANTENNA X3	\N	30.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
27c59a10-3925-4a17-8ab0-cfd7116369c1	SEGWAY	Accessori robot	755340	KIT MONTAGGIO ANTENNA X3	\N	60.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
e024f119-7f81-447a-81a8-4ff0ea4bc1e0	SEGWAY	Accessori robot	755380	KIT ANTENNA SECONDARIA X3 Navimow	\N	300.00	\N	\N	\N	22.00	2026-02-19 06:37:50.080804+00
\.


--
-- Data for Name: messages_2026_02_17; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_17 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_18; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_18 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_19; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_19 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_20; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_20 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_21; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_21 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_22; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_22 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_23; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2026_02_23 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
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
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
1198	d06bf1a8-0e2d-11f1-b0c8-0a58a9feac02	public.commissioni	{}	{"exp": 2082192777, "iat": 1766616777, "iss": "supabase", "ref": "eoswkplehhmtxtattsha", "role": "anon"}	2026-02-20 07:28:57.329905	*
1199	d06bec94-0e2d-11f1-bc95-0a58a9feac02	public.inventory	{}	{"exp": 2082192777, "iat": 1766616777, "iss": "supabase", "ref": "eoswkplehhmtxtattsha", "role": "anon"}	2026-02-20 07:28:57.329905	*
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

SELECT pg_catalog.setval('public.inventory_id_seq', 197, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1199, true);


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
-- Name: listini listini_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listini
    ADD CONSTRAINT listini_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_17 messages_2026_02_17_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_17
    ADD CONSTRAINT messages_2026_02_17_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_18 messages_2026_02_18_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_18
    ADD CONSTRAINT messages_2026_02_18_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_19 messages_2026_02_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_19
    ADD CONSTRAINT messages_2026_02_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_20 messages_2026_02_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_20
    ADD CONSTRAINT messages_2026_02_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_21 messages_2026_02_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_21
    ADD CONSTRAINT messages_2026_02_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_22 messages_2026_02_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_22
    ADD CONSTRAINT messages_2026_02_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_23 messages_2026_02_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_02_23
    ADD CONSTRAINT messages_2026_02_23_pkey PRIMARY KEY (id, inserted_at);


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
-- Name: idx_commissioni_cliente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_cliente ON public.commissioni USING btree (cliente);


--
-- Name: idx_commissioni_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_created ON public.commissioni USING btree (created_at DESC);


--
-- Name: idx_commissioni_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_commissioni_status ON public.commissioni USING btree (status);


--
-- Name: idx_serial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_serial ON public.inventory USING btree ("serialNumber");


--
-- Name: idx_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_status ON public.inventory USING btree (status);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_17_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_17_inserted_at_topic_idx ON realtime.messages_2026_02_17 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_18_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_18_inserted_at_topic_idx ON realtime.messages_2026_02_18 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_19_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_19_inserted_at_topic_idx ON realtime.messages_2026_02_19 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_20_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_20_inserted_at_topic_idx ON realtime.messages_2026_02_20 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_21_inserted_at_topic_idx ON realtime.messages_2026_02_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_22_inserted_at_topic_idx ON realtime.messages_2026_02_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_02_23_inserted_at_topic_idx ON realtime.messages_2026_02_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


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
-- Name: messages_2026_02_17_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_17_inserted_at_topic_idx;


--
-- Name: messages_2026_02_17_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_17_pkey;


--
-- Name: messages_2026_02_18_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_18_inserted_at_topic_idx;


--
-- Name: messages_2026_02_18_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_18_pkey;


--
-- Name: messages_2026_02_19_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_19_inserted_at_topic_idx;


--
-- Name: messages_2026_02_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_19_pkey;


--
-- Name: messages_2026_02_20_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_20_inserted_at_topic_idx;


--
-- Name: messages_2026_02_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_20_pkey;


--
-- Name: messages_2026_02_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_21_inserted_at_topic_idx;


--
-- Name: messages_2026_02_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_21_pkey;


--
-- Name: messages_2026_02_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_22_inserted_at_topic_idx;


--
-- Name: messages_2026_02_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_22_pkey;


--
-- Name: messages_2026_02_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_23_inserted_at_topic_idx;


--
-- Name: messages_2026_02_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_23_pkey;


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
-- Name: listini Accesso completo listini; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Accesso completo listini" ON public.listini USING (true) WITH CHECK (true);


--
-- Name: commissioni Allow all operations on commissioni; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on commissioni" ON public.commissioni USING (true) WITH CHECK (true);


--
-- Name: inventory Enable all access for now; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all access for now" ON public.inventory USING (true);


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

\unrestrict YG8nMIcMm6x4aBFiZaprUC4A1bz5Uk3tsmOr5Ref5GqYLUYHbaF5oZZpQ1NEHIi

