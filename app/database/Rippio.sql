PGDMP      9                |            rippio    16.2    16.2 [    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            N           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            O           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            P           1262    16398    rippio    DATABASE     |   CREATE DATABASE rippio WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Colombia.1252';
    DROP DATABASE rippio;
                postgres    false            �            1259    16523    administrador    TABLE     V   CREATE TABLE public.administrador (
    id uuid NOT NULL,
    id_direccion integer
);
 !   DROP TABLE public.administrador;
       public         heap    postgres    false            �            1259    16700    carrito    TABLE     �   CREATE TABLE public.carrito (
    id integer NOT NULL,
    id_usuario uuid,
    id_producto integer,
    cantidad_prod integer
);
    DROP TABLE public.carrito;
       public         heap    postgres    false            �            1259    16597 	   categoria    TABLE     ]   CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre character varying(50)
);
    DROP TABLE public.categoria;
       public         heap    postgres    false            �            1259    16670    categoria_prod    TABLE     s   CREATE TABLE public.categoria_prod (
    id integer NOT NULL,
    id_producto integer,
    id_categoria integer
);
 "   DROP TABLE public.categoria_prod;
       public         heap    postgres    false            �            1259    16627    categoria_res    TABLE     r   CREATE TABLE public.categoria_res (
    id integer NOT NULL,
    id_restaurante uuid,
    id_categoria integer
);
 !   DROP TABLE public.categoria_res;
       public         heap    postgres    false            �            1259    32773    datos_usuarios    TABLE     5  CREATE TABLE public.datos_usuarios (
    id uuid NOT NULL,
    identificacion integer,
    nombre character varying(50),
    apellido character varying(50),
    email character varying(200),
    telefono bigint,
    "contraseña" character varying,
    tipo_usuario integer,
    img_icon character varying
);
 "   DROP TABLE public.datos_usuarios;
       public         heap    postgres    false            �            1259    16685    detalle_pedido    TABLE     �   CREATE TABLE public.detalle_pedido (
    id integer NOT NULL,
    id_pedido integer,
    id_producto integer,
    costo_unit integer,
    cantidad_prod integer
);
 "   DROP TABLE public.detalle_pedido;
       public         heap    postgres    false            �            1259    16550    detalles_metodo_pago    TABLE     �   CREATE TABLE public.detalles_metodo_pago (
    id integer NOT NULL,
    id_usuario uuid,
    id_metodo_pago integer,
    nombre character varying(50),
    apellido character varying(50),
    numero integer,
    expiracion integer,
    cvv integer
);
 (   DROP TABLE public.detalles_metodo_pago;
       public         heap    postgres    false            �            1259    16508 	   direccion    TABLE     P  CREATE TABLE public.direccion (
    id integer NOT NULL,
    departamento character varying(50),
    ciudad character varying(50),
    barrio character varying(50),
    tipo_via character varying,
    numero_via character varying(10),
    numero_uno character varying(10),
    numero_dos integer,
    observaciones character varying
);
    DROP TABLE public.direccion;
       public         heap    postgres    false            �            1259    32840    direccion_restaurante    TABLE     z   CREATE TABLE public.direccion_restaurante (
    id integer NOT NULL,
    id_restaurante uuid,
    id_direccion integer
);
 )   DROP TABLE public.direccion_restaurante;
       public         heap    postgres    false            �            1259    32825    direccion_usuario    TABLE     r   CREATE TABLE public.direccion_usuario (
    id integer NOT NULL,
    id_usuario uuid,
    id_direccion integer
);
 %   DROP TABLE public.direccion_usuario;
       public         heap    postgres    false            �            1259    16648    horario    TABLE     �   CREATE TABLE public.horario (
    id integer NOT NULL,
    id_restaurante uuid,
    dia_semana character varying(10),
    hora_apertura time without time zone,
    hora_cierre time without time zone
);
    DROP TABLE public.horario;
       public         heap    postgres    false            �            1259    16587    mensaje    TABLE     �   CREATE TABLE public.mensaje (
    id integer NOT NULL,
    id_pedido integer,
    usuario_enviado boolean,
    mensaje integer NOT NULL,
    fecha date
);
    DROP TABLE public.mensaje;
       public         heap    postgres    false            �            1259    16543    metodo_pago    TABLE     [   CREATE TABLE public.metodo_pago (
    id integer NOT NULL,
    nombre character varying
);
    DROP TABLE public.metodo_pago;
       public         heap    postgres    false            �            1259    16560    pedido    TABLE     *  CREATE TABLE public.pedido (
    id integer NOT NULL,
    id_usuario uuid,
    id_restaurante uuid,
    id_direccion integer,
    id_detalles_metodo_pago integer,
    estado character varying(50),
    fecha timestamp without time zone,
    costo_total integer,
    observacion character varying
);
    DROP TABLE public.pedido;
       public         heap    postgres    false            �            1259    16481    plan    TABLE     |   CREATE TABLE public.plan (
    id integer NOT NULL,
    nombre character varying(100),
    descripcion character varying
);
    DROP TABLE public.plan;
       public         heap    postgres    false            �            1259    16486    plan_usuario    TABLE     �   CREATE TABLE public.plan_usuario (
    id integer NOT NULL,
    id_usuario uuid,
    id_plan integer,
    estado boolean,
    fecha_inicio date,
    fecha_termino date
);
     DROP TABLE public.plan_usuario;
       public         heap    postgres    false            �            1259    16658    producto    TABLE     �   CREATE TABLE public.producto (
    id integer NOT NULL,
    id_restaurante uuid,
    estado boolean,
    nombre character varying(50),
    descripcion character varying,
    cost_unit integer,
    img_product character varying
);
    DROP TABLE public.producto;
       public         heap    postgres    false            �            1259    16602    restaurante    TABLE     v   CREATE TABLE public.restaurante (
    id uuid NOT NULL,
    calificacion integer,
    img_banner character varying
);
    DROP TABLE public.restaurante;
       public         heap    postgres    false            �            1259    32780    rol    TABLE     P   CREATE TABLE public.rol (
    id integer NOT NULL,
    rol character varying
);
    DROP TABLE public.rol;
       public         heap    postgres    false            :          0    16523    administrador 
   TABLE DATA           9   COPY public.administrador (id, id_direccion) FROM stdin;
    public          postgres    false    218   �s       F          0    16700    carrito 
   TABLE DATA           M   COPY public.carrito (id, id_usuario, id_producto, cantidad_prod) FROM stdin;
    public          postgres    false    230   t       ?          0    16597 	   categoria 
   TABLE DATA           /   COPY public.categoria (id, nombre) FROM stdin;
    public          postgres    false    223   #t       D          0    16670    categoria_prod 
   TABLE DATA           G   COPY public.categoria_prod (id, id_producto, id_categoria) FROM stdin;
    public          postgres    false    228   @t       A          0    16627    categoria_res 
   TABLE DATA           I   COPY public.categoria_res (id, id_restaurante, id_categoria) FROM stdin;
    public          postgres    false    225   ]t       G          0    32773    datos_usuarios 
   TABLE DATA           �   COPY public.datos_usuarios (id, identificacion, nombre, apellido, email, telefono, "contraseña", tipo_usuario, img_icon) FROM stdin;
    public          postgres    false    231   zt       E          0    16685    detalle_pedido 
   TABLE DATA           _   COPY public.detalle_pedido (id, id_pedido, id_producto, costo_unit, cantidad_prod) FROM stdin;
    public          postgres    false    229   �t       <          0    16550    detalles_metodo_pago 
   TABLE DATA           y   COPY public.detalles_metodo_pago (id, id_usuario, id_metodo_pago, nombre, apellido, numero, expiracion, cvv) FROM stdin;
    public          postgres    false    220   u       9          0    16508 	   direccion 
   TABLE DATA           �   COPY public.direccion (id, departamento, ciudad, barrio, tipo_via, numero_via, numero_uno, numero_dos, observaciones) FROM stdin;
    public          postgres    false    217   2u       J          0    32840    direccion_restaurante 
   TABLE DATA           Q   COPY public.direccion_restaurante (id, id_restaurante, id_direccion) FROM stdin;
    public          postgres    false    234   Ou       I          0    32825    direccion_usuario 
   TABLE DATA           I   COPY public.direccion_usuario (id, id_usuario, id_direccion) FROM stdin;
    public          postgres    false    233   lu       B          0    16648    horario 
   TABLE DATA           ]   COPY public.horario (id, id_restaurante, dia_semana, hora_apertura, hora_cierre) FROM stdin;
    public          postgres    false    226   �u       >          0    16587    mensaje 
   TABLE DATA           Q   COPY public.mensaje (id, id_pedido, usuario_enviado, mensaje, fecha) FROM stdin;
    public          postgres    false    222   �u       ;          0    16543    metodo_pago 
   TABLE DATA           1   COPY public.metodo_pago (id, nombre) FROM stdin;
    public          postgres    false    219   �u       =          0    16560    pedido 
   TABLE DATA           �   COPY public.pedido (id, id_usuario, id_restaurante, id_direccion, id_detalles_metodo_pago, estado, fecha, costo_total, observacion) FROM stdin;
    public          postgres    false    221   �u       7          0    16481    plan 
   TABLE DATA           7   COPY public.plan (id, nombre, descripcion) FROM stdin;
    public          postgres    false    215   �u       8          0    16486    plan_usuario 
   TABLE DATA           d   COPY public.plan_usuario (id, id_usuario, id_plan, estado, fecha_inicio, fecha_termino) FROM stdin;
    public          postgres    false    216   v       C          0    16658    producto 
   TABLE DATA           k   COPY public.producto (id, id_restaurante, estado, nombre, descripcion, cost_unit, img_product) FROM stdin;
    public          postgres    false    227   7v       @          0    16602    restaurante 
   TABLE DATA           C   COPY public.restaurante (id, calificacion, img_banner) FROM stdin;
    public          postgres    false    224   Tv       H          0    32780    rol 
   TABLE DATA           &   COPY public.rol (id, rol) FROM stdin;
    public          postgres    false    232   qv       �           2606    32844 .   direccion_restaurante pk_direccion_restaurante 
   CONSTRAINT     l   ALTER TABLE ONLY public.direccion_restaurante
    ADD CONSTRAINT pk_direccion_restaurante PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.direccion_restaurante DROP CONSTRAINT pk_direccion_restaurante;
       public            postgres    false    234            l           2606    32814 !   administrador pk_id_administrador 
   CONSTRAINT     _   ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT pk_id_administrador PRIMARY KEY (id);
 K   ALTER TABLE ONLY public.administrador DROP CONSTRAINT pk_id_administrador;
       public            postgres    false    218            �           2606    16704    carrito pk_id_carrito 
   CONSTRAINT     S   ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT pk_id_carrito PRIMARY KEY (id);
 ?   ALTER TABLE ONLY public.carrito DROP CONSTRAINT pk_id_carrito;
       public            postgres    false    230            v           2606    16601    categoria pk_id_categoria 
   CONSTRAINT     W   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT pk_id_categoria PRIMARY KEY (id);
 C   ALTER TABLE ONLY public.categoria DROP CONSTRAINT pk_id_categoria;
       public            postgres    false    223            �           2606    16674 #   categoria_prod pk_id_categoria_prod 
   CONSTRAINT     a   ALTER TABLE ONLY public.categoria_prod
    ADD CONSTRAINT pk_id_categoria_prod PRIMARY KEY (id);
 M   ALTER TABLE ONLY public.categoria_prod DROP CONSTRAINT pk_id_categoria_prod;
       public            postgres    false    228            z           2606    16631 !   categoria_res pk_id_categoria_res 
   CONSTRAINT     _   ALTER TABLE ONLY public.categoria_res
    ADD CONSTRAINT pk_id_categoria_res PRIMARY KEY (id);
 K   ALTER TABLE ONLY public.categoria_res DROP CONSTRAINT pk_id_categoria_res;
       public            postgres    false    225            �           2606    32779 "   datos_usuarios pk_id_datos_usuario 
   CONSTRAINT     `   ALTER TABLE ONLY public.datos_usuarios
    ADD CONSTRAINT pk_id_datos_usuario PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.datos_usuarios DROP CONSTRAINT pk_id_datos_usuario;
       public            postgres    false    231            �           2606    32951 #   detalle_pedido pk_id_detalle_pedido 
   CONSTRAINT     a   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT pk_id_detalle_pedido PRIMARY KEY (id);
 M   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT pk_id_detalle_pedido;
       public            postgres    false    229            p           2606    24584 /   detalles_metodo_pago pk_id_detalles_metodo_pago 
   CONSTRAINT     m   ALTER TABLE ONLY public.detalles_metodo_pago
    ADD CONSTRAINT pk_id_detalles_metodo_pago PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.detalles_metodo_pago DROP CONSTRAINT pk_id_detalles_metodo_pago;
       public            postgres    false    220            j           2606    16512    direccion pk_id_direccion 
   CONSTRAINT     W   ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT pk_id_direccion PRIMARY KEY (id);
 C   ALTER TABLE ONLY public.direccion DROP CONSTRAINT pk_id_direccion;
       public            postgres    false    217            �           2606    32829 )   direccion_usuario pk_id_direccion_usuario 
   CONSTRAINT     g   ALTER TABLE ONLY public.direccion_usuario
    ADD CONSTRAINT pk_id_direccion_usuario PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.direccion_usuario DROP CONSTRAINT pk_id_direccion_usuario;
       public            postgres    false    233            |           2606    16652    horario pk_id_horario 
   CONSTRAINT     S   ALTER TABLE ONLY public.horario
    ADD CONSTRAINT pk_id_horario PRIMARY KEY (id);
 ?   ALTER TABLE ONLY public.horario DROP CONSTRAINT pk_id_horario;
       public            postgres    false    226            t           2606    16716    mensaje pk_id_mensaje 
   CONSTRAINT     S   ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT pk_id_mensaje PRIMARY KEY (id);
 ?   ALTER TABLE ONLY public.mensaje DROP CONSTRAINT pk_id_mensaje;
       public            postgres    false    222            n           2606    16549    metodo_pago pk_id_metodo_pago 
   CONSTRAINT     [   ALTER TABLE ONLY public.metodo_pago
    ADD CONSTRAINT pk_id_metodo_pago PRIMARY KEY (id);
 G   ALTER TABLE ONLY public.metodo_pago DROP CONSTRAINT pk_id_metodo_pago;
       public            postgres    false    219            r           2606    16566    pedido pk_id_pedido 
   CONSTRAINT     Q   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pk_id_pedido PRIMARY KEY (id);
 =   ALTER TABLE ONLY public.pedido DROP CONSTRAINT pk_id_pedido;
       public            postgres    false    221            f           2606    16485    plan pk_id_plan 
   CONSTRAINT     M   ALTER TABLE ONLY public.plan
    ADD CONSTRAINT pk_id_plan PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.plan DROP CONSTRAINT pk_id_plan;
       public            postgres    false    215            h           2606    32800    plan_usuario pk_id_plan_usuario 
   CONSTRAINT     ]   ALTER TABLE ONLY public.plan_usuario
    ADD CONSTRAINT pk_id_plan_usuario PRIMARY KEY (id);
 I   ALTER TABLE ONLY public.plan_usuario DROP CONSTRAINT pk_id_plan_usuario;
       public            postgres    false    216            ~           2606    16664    producto pk_id_producto 
   CONSTRAINT     U   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT pk_id_producto PRIMARY KEY (id);
 A   ALTER TABLE ONLY public.producto DROP CONSTRAINT pk_id_producto;
       public            postgres    false    227            x           2606    32793    restaurante pk_id_restaurante 
   CONSTRAINT     [   ALTER TABLE ONLY public.restaurante
    ADD CONSTRAINT pk_id_restaurante PRIMARY KEY (id);
 G   ALTER TABLE ONLY public.restaurante DROP CONSTRAINT pk_id_restaurante;
       public            postgres    false    224            �           2606    32786    rol pk_id_rol 
   CONSTRAINT     K   ALTER TABLE ONLY public.rol
    ADD CONSTRAINT pk_id_rol PRIMARY KEY (id);
 7   ALTER TABLE ONLY public.rol DROP CONSTRAINT pk_id_rol;
       public            postgres    false    232            �           2606    32815    administrador fk_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT fk_id FOREIGN KEY (id) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.administrador DROP CONSTRAINT fk_id;
       public          postgres    false    218    4742    231            �           2606    32925    categoria_res fk_id_categoria    FK CONSTRAINT     �   ALTER TABLE ONLY public.categoria_res
    ADD CONSTRAINT fk_id_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id) ON UPDATE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.categoria_res DROP CONSTRAINT fk_id_categoria;
       public          postgres    false    4726    223    225            �           2606    32945    categoria_prod fk_id_categoria    FK CONSTRAINT     �   ALTER TABLE ONLY public.categoria_prod
    ADD CONSTRAINT fk_id_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id) ON UPDATE CASCADE NOT VALID;
 H   ALTER TABLE ONLY public.categoria_prod DROP CONSTRAINT fk_id_categoria;
       public          postgres    false    228    4726    223            �           2606    32794     restaurante fk_id_datos_usuarios    FK CONSTRAINT     �   ALTER TABLE ONLY public.restaurante
    ADD CONSTRAINT fk_id_datos_usuarios FOREIGN KEY (id) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 J   ALTER TABLE ONLY public.restaurante DROP CONSTRAINT fk_id_datos_usuarios;
       public          postgres    false    224    4742    231            �           2606    32905 !   pedido fk_id_detalles_metodo_pago    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_id_detalles_metodo_pago FOREIGN KEY (id_detalles_metodo_pago) REFERENCES public.detalles_metodo_pago(id) ON UPDATE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.pedido DROP CONSTRAINT fk_id_detalles_metodo_pago;
       public          postgres    false    221    220    4720            �           2606    32820    administrador fk_id_direccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT fk_id_direccion FOREIGN KEY (id_direccion) REFERENCES public.direccion(id) ON UPDATE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.administrador DROP CONSTRAINT fk_id_direccion;
       public          postgres    false    218    217    4714            �           2606    32835 !   direccion_usuario fk_id_direccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.direccion_usuario
    ADD CONSTRAINT fk_id_direccion FOREIGN KEY (id_direccion) REFERENCES public.direccion(id) ON UPDATE CASCADE;
 K   ALTER TABLE ONLY public.direccion_usuario DROP CONSTRAINT fk_id_direccion;
       public          postgres    false    233    217    4714            �           2606    32850 %   direccion_restaurante fk_id_direccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.direccion_restaurante
    ADD CONSTRAINT fk_id_direccion FOREIGN KEY (id_direccion) REFERENCES public.direccion(id) ON UPDATE CASCADE;
 O   ALTER TABLE ONLY public.direccion_restaurante DROP CONSTRAINT fk_id_direccion;
       public          postgres    false    4714    234    217            �           2606    32910    pedido fk_id_direccion    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_id_direccion FOREIGN KEY (id_direccion) REFERENCES public.direccion(id) ON UPDATE CASCADE NOT VALID;
 @   ALTER TABLE ONLY public.pedido DROP CONSTRAINT fk_id_direccion;
       public          postgres    false    4714    217    221            �           2606    32860 &   detalles_metodo_pago fk_id_metodo_pago    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalles_metodo_pago
    ADD CONSTRAINT fk_id_metodo_pago FOREIGN KEY (id_metodo_pago) REFERENCES public.metodo_pago(id) ON UPDATE CASCADE NOT VALID;
 P   ALTER TABLE ONLY public.detalles_metodo_pago DROP CONSTRAINT fk_id_metodo_pago;
       public          postgres    false    4718    220    219            �           2606    32915    mensaje fk_id_pedido    FK CONSTRAINT     �   ALTER TABLE ONLY public.mensaje
    ADD CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id) ON UPDATE CASCADE NOT VALID;
 >   ALTER TABLE ONLY public.mensaje DROP CONSTRAINT fk_id_pedido;
       public          postgres    false    4722    222    221            �           2606    32962    detalle_pedido fk_id_pedido    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id) ON UPDATE CASCADE NOT VALID;
 E   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT fk_id_pedido;
       public          postgres    false    229    221    4722            �           2606    32806    plan_usuario fk_id_plan    FK CONSTRAINT     �   ALTER TABLE ONLY public.plan_usuario
    ADD CONSTRAINT fk_id_plan FOREIGN KEY (id_plan) REFERENCES public.plan(id) ON UPDATE CASCADE NOT VALID;
 A   ALTER TABLE ONLY public.plan_usuario DROP CONSTRAINT fk_id_plan;
       public          postgres    false    216    4710    215            �           2606    32940    categoria_prod fk_id_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.categoria_prod
    ADD CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id) ON UPDATE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.categoria_prod DROP CONSTRAINT fk_id_producto;
       public          postgres    false    228    4734    227            �           2606    32957    carrito fk_id_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id) ON UPDATE CASCADE NOT VALID;
 @   ALTER TABLE ONLY public.carrito DROP CONSTRAINT fk_id_producto;
       public          postgres    false    230    227    4734            �           2606    32967    detalle_pedido fk_id_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id) ON UPDATE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.detalle_pedido DROP CONSTRAINT fk_id_producto;
       public          postgres    false    227    4734    229            �           2606    32845 '   direccion_restaurante fk_id_restaurante    FK CONSTRAINT     �   ALTER TABLE ONLY public.direccion_restaurante
    ADD CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante) REFERENCES public.restaurante(id) ON UPDATE CASCADE;
 Q   ALTER TABLE ONLY public.direccion_restaurante DROP CONSTRAINT fk_id_restaurante;
       public          postgres    false    224    234    4728            �           2606    32900    pedido fk_id_restaurante    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante) REFERENCES public.restaurante(id) ON UPDATE CASCADE NOT VALID;
 B   ALTER TABLE ONLY public.pedido DROP CONSTRAINT fk_id_restaurante;
       public          postgres    false    224    221    4728            �           2606    32920    categoria_res fk_id_restaurante    FK CONSTRAINT     �   ALTER TABLE ONLY public.categoria_res
    ADD CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante) REFERENCES public.restaurante(id) ON UPDATE CASCADE NOT VALID;
 I   ALTER TABLE ONLY public.categoria_res DROP CONSTRAINT fk_id_restaurante;
       public          postgres    false    4728    224    225            �           2606    32935    producto fk_id_restaurante    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_id_restaurante FOREIGN KEY (id_restaurante) REFERENCES public.restaurante(id) ON UPDATE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.producto DROP CONSTRAINT fk_id_restaurante;
       public          postgres    false    4728    227    224            �           2606    32787    datos_usuarios fk_id_rol    FK CONSTRAINT     �   ALTER TABLE ONLY public.datos_usuarios
    ADD CONSTRAINT fk_id_rol FOREIGN KEY (tipo_usuario) REFERENCES public.rol(id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 B   ALTER TABLE ONLY public.datos_usuarios DROP CONSTRAINT fk_id_rol;
       public          postgres    false    231    232    4744            �           2606    32801    plan_usuario fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.plan_usuario
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.plan_usuario DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    231    216    4742            �           2606    32830    direccion_usuario fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.direccion_usuario
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE;
 I   ALTER TABLE ONLY public.direccion_usuario DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    231    233    4742            �           2606    32855 "   detalles_metodo_pago fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalles_metodo_pago
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 L   ALTER TABLE ONLY public.detalles_metodo_pago DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    4742    231    220            �           2606    32895    pedido fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 >   ALTER TABLE ONLY public.pedido DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    231    4742    221            �           2606    32952    carrito fk_id_usuario    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES public.datos_usuarios(id) ON UPDATE CASCADE NOT VALID;
 ?   ALTER TABLE ONLY public.carrito DROP CONSTRAINT fk_id_usuario;
       public          postgres    false    231    230    4742            �           2606    32930    horario id_restaurante    FK CONSTRAINT     �   ALTER TABLE ONLY public.horario
    ADD CONSTRAINT id_restaurante FOREIGN KEY (id_restaurante) REFERENCES public.restaurante(id) ON UPDATE CASCADE NOT VALID;
 @   ALTER TABLE ONLY public.horario DROP CONSTRAINT id_restaurante;
       public          postgres    false    4728    226    224            :      x������ � �      F      x������ � �      ?      x������ � �      D      x������ � �      A      x������ � �      G   n   x�ȹ�0@њ�E�HI��H�"��a1|4�`�!�E�o�wU)�ܢ�sl�����(�� b������r��{���b]�L�]��`����� �Ra~��<��5�      E      x������ � �      <      x������ � �      9      x������ � �      J      x������ � �      I      x������ � �      B      x������ � �      >      x������ � �      ;      x������ � �      =      x������ � �      7      x������ � �      8      x������ � �      C      x������ � �      @      x������ � �      H      x������ � �     