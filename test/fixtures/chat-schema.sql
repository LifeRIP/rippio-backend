CREATE TABLE public.datos_usuarios (
    id uuid NOT NULL,
    identificacion bigint,
    nombre character varying(50),
    apellido character varying(50),
    email character varying(200),
    telefono bigint,
    "contraseña" character varying,
    tipo_usuario integer,
    img_icon character varying,
    estado boolean,
    creditos bigint,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.pedido (
    id integer NOT NULL,
    id_usuario uuid,
    id_restaurante uuid,
    id_direccion integer,
    id_detalles_metodo_pago integer,
    estado character varying(50),
    fecha timestamp without time zone,
    costo_total integer,
    costo_envio integer,
    creditos_usados integer
);

CREATE TABLE public.conversacion_pedido (
    id integer NOT NULL,
    id_pedido integer,
    id_restaurante uuid,
    id_usuario uuid,
    estado boolean DEFAULT true
);

CREATE TABLE public.mensaje_pedido (
    id integer NOT NULL,
    id_conversacion integer,
    id_usuario uuid,
    mensaje text,
    fecha timestamp with time zone,
    estado boolean DEFAULT true
);

ALTER TABLE public.conversacion_pedido ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.conversacion_pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.mensaje_pedido ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.mensaje_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.datos_usuarios ADD PRIMARY KEY (id);

ALTER TABLE public.pedido ADD PRIMARY KEY (id);

ALTER TABLE public.conversacion_pedido ADD PRIMARY KEY (id);

ALTER TABLE public.mensaje_pedido ADD PRIMARY KEY (id);

ALTER TABLE public.mensaje_pedido ADD CONSTRAINT fk_id_conversacion_pedido FOREIGN KEY (id_conversacion) REFERENCES public.conversacion_pedido(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;