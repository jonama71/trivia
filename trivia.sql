toc.dat                                                                                             0000600 0004000 0002000 00000041224 14753722170 0014452 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   4                    }            trivia    17.2    17.2 D    t           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false         u           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false         v           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false         w           1262    16548    trivia    DATABASE     y   CREATE DATABASE trivia WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE trivia;
                     postgres    false         9          0    17590    areas 
   TABLE DATA           ?   COPY public.areas (id_area, nombre_area, img_area) FROM stdin;
    public               postgres    false    224       5177.dat ?          0    17620    configuracion_desafio_mate 
   TABLE DATA           m   COPY public.configuracion_desafio_mate (id_configuracion_desa, id_desafio, nombre_configuracion) FROM stdin;
    public               postgres    false    230       5183.dat =          0    17613    configuracion_general 
   TABLE DATA           W   COPY public.configuracion_general (id_configuracion, nombre_configuracion) FROM stdin;
    public               postgres    false    228       5181.dat A          0    17632    configuracion_trivia 
   TABLE DATA           a   COPY public.configuracion_trivia (id_configuracion, id_trivia, nombre_configuracion) FROM stdin;
    public               postgres    false    232       5185.dat ;          0    17599    desafio_matematico 
   TABLE DATA           o   COPY public.desafio_matematico (id_desafio, id_modulo, intro_video_url, banner_url, tiempo_ruleta) FROM stdin;
    public               postgres    false    226       5179.dat m          0    17956    efectos_especiales 
   TABLE DATA           j   COPY public.efectos_especiales (id_efectos_especiales, id_configuracion, nombre, url_efectos) FROM stdin;
    public               postgres    false    276       5229.dat U          0    17760    estado_partida 
   TABLE DATA           �   COPY public.estado_partida (id_estado, id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul, contador_preguntas, puntos_equipo_rojo, puntos_equipo_azul) FROM stdin;
    public               postgres    false    252       5205.dat G          0    17665    explicaciones_area 
   TABLE DATA           ^   COPY public.explicaciones_area (id_explicacion, id_pregunta, url_img_explicacion) FROM stdin;
    public               postgres    false    238       5191.dat C          0    17644    instituciones 
   TABLE DATA           K   COPY public.instituciones (id_institucion, nombre_institucion) FROM stdin;
    public               postgres    false    234       5187.dat 3          0    17559    modulo 
   TABLE DATA           :   COPY public.modulo (id_modulo, nombre_modulo) FROM stdin;
    public               postgres    false    218       5171.dat q          0    17984    pagina_principal 
   TABLE DATA           \   COPY public.pagina_principal (id_pagina, id_configuracion, url_fondo_principal) FROM stdin;
    public               postgres    false    280       5233.dat E          0    17651    preguntas_area 
   TABLE DATA           P   COPY public.preguntas_area (id_pregunta, id_area, url_img_pregunta) FROM stdin;
    public               postgres    false    236       5189.dat W          0    17772    preguntas_desafio 
   TABLE DATA           �   COPY public.preguntas_desafio (id_pregunta_desafio, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM stdin;
    public               postgres    false    254       5207.dat o          0    17970    preguntas_desafio_publico 
   TABLE DATA           �   COPY public.preguntas_desafio_publico (id_pregunta_desafio_publico, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM stdin;
    public               postgres    false    278       5231.dat Y          0    17786    preguntas_publico 
   TABLE DATA           l   COPY public.preguntas_publico (id_pregunta_publico, id_configuracion, url_img_pregunta_publico) FROM stdin;
    public               postgres    false    256       5209.dat I          0    17679 
   publicidad 
   TABLE DATA           h   COPY public.publicidad (id_publicidad, id_configuracion, nombre_video_foto, url_video_foto) FROM stdin;
    public               postgres    false    240       5193.dat K          0    17693    reloj 
   TABLE DATA           C   COPY public.reloj (id_reloj, id_configuracion, tiempo) FROM stdin;
    public               postgres    false    242       5195.dat [          0    17800    respuestas_area 
   TABLE DATA           W   COPY public.respuestas_area (id_respuesta, id_pregunta, url_img_respuesta) FROM stdin;
    public               postgres    false    258       5211.dat ]          0    17814    respuestas_publico 
   TABLE DATA           �   COPY public.respuestas_publico (id_respuesta_publico, id_configuracion, id_pregunta_publico, url_img_respuesta_publico) FROM stdin;
    public               postgres    false    260       5213.dat Q          0    17731    ruleta_areas_detalles 
   TABLE DATA           ^   COPY public.ruleta_areas_detalles (id_ruleta_areas_detalles, id_ruletas, id_area) FROM stdin;
    public               postgres    false    248       5201.dat S          0    17748    ruleta_comodin_detalle 
   TABLE DATA           f   COPY public.ruleta_comodin_detalle (id_ruleta_comodin_detalle, id_ruletas, texto_comodin) FROM stdin;
    public               postgres    false    250       5203.dat k          0    17927    ruleta_desafio 
   TABLE DATA           k   COPY public.ruleta_desafio (id_ruleta_desafio, id_configuracion_desa, texto, url_logo, tiempo) FROM stdin;
    public               postgres    false    274       5227.dat O          0    17717    ruleta_turno_detalle 
   TABLE DATA           d   COPY public.ruleta_turno_detalle (id_ruleta_turno_detalle, id_ruletas, texto, url_logo) FROM stdin;
    public               postgres    false    246       5199.dat M          0    17705    ruletas 
   TABLE DATA           T   COPY public.ruletas (id_ruletas, id_configuracion, tipo_ruleta, tiempo) FROM stdin;
    public               postgres    false    244       5197.dat _          0    17833    sorteo_desafio 
   TABLE DATA           �   COPY public.sorteo_desafio (id_sorteo_desafio, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_desafio) FROM stdin;
    public               postgres    false    262       5215.dat a          0    17852    sorteo_trivia 
   TABLE DATA           �   COPY public.sorteo_trivia (id_sorteo_trivia, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_trivia) FROM stdin;
    public               postgres    false    264       5217.dat 7          0    17578    sorteos 
   TABLE DATA           8   COPY public.sorteos (id_sorteos, id_modulo) FROM stdin;
    public               postgres    false    222       5175.dat 5          0    17566    trivia 
   TABLE DATA           6   COPY public.trivia (id_trivia, id_modulo) FROM stdin;
    public               postgres    false    220       5173.dat c          0    17871    videos 
   TABLE DATA           c   COPY public.videos (id_video, id_configuracion, nombre_video, url_video, fecha_subida) FROM stdin;
    public               postgres    false    266       5219.dat e          0    17885    videos_desafio_mate 
   TABLE DATA           �   COPY public.videos_desafio_mate (id_video_desafio, id_configuracion_desa, nombre_video_desafio, url_video_desafio, fecha_subida) FROM stdin;
    public               postgres    false    268       5221.dat g          0    17899    videos_trivia 
   TABLE DATA              COPY public.videos_trivia (id_video_trivia, id_configuracion, nombre_video_trivia, url_video_trivia, fecha_subida) FROM stdin;
    public               postgres    false    270       5223.dat i          0    17913    videos_trivia_comodin 
   TABLE DATA           �   COPY public.videos_trivia_comodin (id_video_trivia_comodin, id_configuracion, nombre_video_trivia_comodin, url_video_trivia_comodin, fecha_subida) FROM stdin;
    public               postgres    false    272       5225.dat �           0    0    areas_id_area_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.areas_id_area_seq', 4, true);
          public               postgres    false    223         �           0    0 4   configuracion_desafio_mate_id_configuracion_desa_seq    SEQUENCE SET     c   SELECT pg_catalog.setval('public.configuracion_desafio_mate_id_configuracion_desa_seq', 1, false);
          public               postgres    false    229         �           0    0 *   configuracion_general_id_configuracion_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.configuracion_general_id_configuracion_seq', 4, true);
          public               postgres    false    227         �           0    0 )   configuracion_trivia_id_configuracion_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.configuracion_trivia_id_configuracion_seq', 6, true);
          public               postgres    false    231         �           0    0 !   desafio_matematico_id_desafio_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.desafio_matematico_id_desafio_seq', 1, false);
          public               postgres    false    225         �           0    0 ,   efectos_especiales_id_efectos_especiales_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.efectos_especiales_id_efectos_especiales_seq', 1, true);
          public               postgres    false    275         �           0    0    estado_partida_id_estado_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.estado_partida_id_estado_seq', 1, false);
          public               postgres    false    251         �           0    0 %   explicaciones_area_id_explicacion_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.explicaciones_area_id_explicacion_seq', 10, true);
          public               postgres    false    237         �           0    0     instituciones_id_institucion_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.instituciones_id_institucion_seq', 4, true);
          public               postgres    false    233         �           0    0    modulo_id_modulo_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.modulo_id_modulo_seq', 4, true);
          public               postgres    false    217         �           0    0    pagina_principal_id_pagina_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.pagina_principal_id_pagina_seq', 1, false);
          public               postgres    false    279         �           0    0    preguntas_area_id_pregunta_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.preguntas_area_id_pregunta_seq', 12, true);
          public               postgres    false    235         �           0    0 )   preguntas_desafio_id_pregunta_desafio_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.preguntas_desafio_id_pregunta_desafio_seq', 1, false);
          public               postgres    false    253         �           0    0 9   preguntas_desafio_publico_id_pregunta_desafio_publico_seq    SEQUENCE SET     h   SELECT pg_catalog.setval('public.preguntas_desafio_publico_id_pregunta_desafio_publico_seq', 1, false);
          public               postgres    false    277         �           0    0 )   preguntas_publico_id_pregunta_publico_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.preguntas_publico_id_pregunta_publico_seq', 1, true);
          public               postgres    false    255         �           0    0    publicidad_id_publicidad_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.publicidad_id_publicidad_seq', 4, true);
          public               postgres    false    239         �           0    0    reloj_id_reloj_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.reloj_id_reloj_seq', 82, true);
          public               postgres    false    241         �           0    0     respuestas_area_id_respuesta_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.respuestas_area_id_respuesta_seq', 10, true);
          public               postgres    false    257         �           0    0 +   respuestas_publico_id_respuesta_publico_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.respuestas_publico_id_respuesta_publico_seq', 1, true);
          public               postgres    false    259         �           0    0 2   ruleta_areas_detalles_id_ruleta_areas_detalles_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.ruleta_areas_detalles_id_ruleta_areas_detalles_seq', 1, false);
          public               postgres    false    247         �           0    0 4   ruleta_comodin_detalle_id_ruleta_comodin_detalle_seq    SEQUENCE SET     b   SELECT pg_catalog.setval('public.ruleta_comodin_detalle_id_ruleta_comodin_detalle_seq', 2, true);
          public               postgres    false    249         �           0    0 $   ruleta_desafio_id_ruleta_desafio_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.ruleta_desafio_id_ruleta_desafio_seq', 1, false);
          public               postgres    false    273         �           0    0 0   ruleta_turno_detalle_id_ruleta_turno_detalle_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.ruleta_turno_detalle_id_ruleta_turno_detalle_seq', 1, false);
          public               postgres    false    245         �           0    0    ruletas_id_ruletas_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.ruletas_id_ruletas_seq', 4, true);
          public               postgres    false    243         �           0    0 $   sorteo_desafio_id_sorteo_desafio_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.sorteo_desafio_id_sorteo_desafio_seq', 1, false);
          public               postgres    false    261         �           0    0 "   sorteo_trivia_id_sorteo_trivia_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.sorteo_trivia_id_sorteo_trivia_seq', 3, true);
          public               postgres    false    263         �           0    0    sorteos_id_sorteos_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.sorteos_id_sorteos_seq', 1, true);
          public               postgres    false    221         �           0    0    trivia_id_trivia_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.trivia_id_trivia_seq', 1, true);
          public               postgres    false    219         �           0    0 (   videos_desafio_mate_id_video_desafio_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public.videos_desafio_mate_id_video_desafio_seq', 1, false);
          public               postgres    false    267         �           0    0    videos_id_video_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.videos_id_video_seq', 31, true);
          public               postgres    false    265         �           0    0 1   videos_trivia_comodin_id_video_trivia_comodin_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.videos_trivia_comodin_id_video_trivia_comodin_seq', 2, true);
          public               postgres    false    271         �           0    0 !   videos_trivia_id_video_trivia_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.videos_trivia_id_video_trivia_seq', 5, true);
          public               postgres    false    269                                                                                                                                                                                                                                                                                                                                                                                    5177.dat                                                                                            0000600 0004000 0002000 00000000514 14753722170 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2	lengua	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738189572046_lengua.jpeg
3	ciencias	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738192179551_ciencias.jpg
4	biologia	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738768424400_biologia.jpg
\.


                                                                                                                                                                                    5183.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5181.dat                                                                                            0000600 0004000 0002000 00000000110 14753722170 0014250 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	configurar_reloj_espera
2	publicidad
3	pagina_principal
4	videos
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                        5185.dat                                                                                            0000600 0004000 0002000 00000000204 14753722170 0014260 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	Preguntas público
2	1	Respuestas público
3	1	Videos trivia
4	1	Videos trivia comodín
5	1	Efectos especiales
6	1	Ruletas
\.


                                                                                                                                                                                                                                                                                                                                                                                            5179.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5229.dat                                                                                            0000600 0004000 0002000 00000000162 14753722170 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	5	explosion	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738293566160_musi.mp3
\.


                                                                                                                                                                                                                                                                                                                                                                                                              5205.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014250 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5191.dat                                                                                            0000600 0004000 0002000 00000002125 14753722170 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	3	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299450583_explicacion_001.jpg
2	4	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299452649_explicacion_002.jpg
3	5	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299454685_explicacion_003.jpg
4	6	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299456738_explicacion_004.jpg
5	7	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299458712_explicacion_005.jpg
6	8	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299460747_explicacion_006.jpg
7	9	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299462710_explicacion_007.jpg
8	10	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299464039_explicacion_008.jpg
9	11	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299465415_explicacion_009.jpg
10	12	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299466606_explicacion_010.jpg
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                           5187.dat                                                                                            0000600 0004000 0002000 00000000105 14753722170 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2	Santa Juana de Chantal
4	chantal
3	Teodoro Gómez de la Torre
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                           5171.dat                                                                                            0000600 0004000 0002000 00000000056 14753722170 0014260 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        4	Desafio Matemático
1	Trivia
3	Sorteos
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  5233.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014251 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5189.dat                                                                                            0000600 0004000 0002000 00000002060 14753722170 0014266 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        4	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299451176_pregunta_002.jpg
5	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299453211_pregunta_003.jpg
6	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299455259_pregunta_004.jpg
7	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299457298_pregunta_005.jpg
8	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299459268_pregunta_006.jpg
9	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299461309_pregunta_007.jpg
10	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299463032_pregunta_008.jpg
11	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299464371_pregunta_009.jpg
12	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299465794_pregunta_010.jpg
3	2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738346574276_p_001.jpeg
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                5207.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014252 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5231.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014247 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5209.dat                                                                                            0000600 0004000 0002000 00000000153 14753722170 0014260 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738280491350_lengua.jpeg
\.


                                                                                                                                                                                                                                                                                                                                                                                                                     5193.dat                                                                                            0000600 0004000 0002000 00000000745 14753722170 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	2	publicidad_1	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739339736800_publicidad_1.mp4
2	2	publicidad_2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739340771379_publicidad_2.mp4
3	2	publicidad_3	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739341570773_publicidad_3.mp4
4	2	publicidad_4	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739341872699_publicidad_4.mp4
\.


                           5195.dat                                                                                            0000600 0004000 0002000 00000002170 14753722170 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	00:10:00
2	1	00:05:00
3	1	00:02:00
4	1	00:01:00
5	1	00:06:30
6	1	00:06:30
7	1	00:06:30
8	1	00:06:30
9	1	00:06:30
10	1	00:06:30
11	1	00:06:30
12	1	00:09:01
13	1	00:06:30
14	1	00:00:30
15	1	00:01:00
16	1	00:07:30
17	1	00:08:30
18	1	00:09:30
19	1	00:10:00
20	1	00:10:30
21	1	00:10:30
22	1	00:10:30
23	1	00:15:00
24	1	00:11:00
25	1	00:11:30
26	1	00:15:00
27	1	00:12:30
28	1	00:11:00
29	1	00:16:00
30	1	00:11:00
31	1	00:11:00
32	1	00:11:30
33	1	00:12:30
34	1	00:13:30
35	1	00:14:30
36	1	00:14:30
37	1	00:14:30
38	1	00:14:30
39	1	00:14:30
40	1	00:12:30
41	1	00:12:32
42	1	00:00:30
43	1	00:00:30
44	1	00:00:30
45	1	00:00:30
46	1	00:00:30
47	1	00:01:30
48	1	00:02:30
49	1	00:03:30
50	1	00:03:30
51	1	00:03:30
52	1	00:03:30
53	1	00:03:30
54	1	00:03:30
55	1	00:03:30
56	1	00:03:30
57	1	00:03:30
58	1	00:03:30
59	1	00:03:30
60	1	00:03:30
61	1	00:03:30
62	1	00:03:30
63	1	00:03:30
64	1	00:03:30
65	1	00:03:30
66	1	00:03:30
67	1	00:03:30
68	1	00:03:30
69	1	00:03:30
70	1	00:03:30
71	1	00:03:30
72	1	00:03:30
73	1	00:03:30
74	1	00:03:30
75	1	00:03:30
76	1	00:03:30
77	1	00:03:30
78	1	00:03:30
79	1	00:03:30
80	1	00:03:30
81	1	00:03:30
82	1	00:00:30
\.


                                                                                                                                                                                                                                                                                                                                                                                                        5211.dat                                                                                            0000600 0004000 0002000 00000002101 14753722170 0014244 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	3	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299449932_respuesta_001.jpg
2	4	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299452046_respuesta_002.jpg
3	5	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299454038_respuesta_003.jpg
4	6	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299456071_respuesta_004.jpg
5	7	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299458111_respuesta_005.jpg
6	8	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299460138_respuesta_006.jpg
7	9	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299462116_respuesta_007.jpg
8	10	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299463629_respuesta_008.jpg
9	11	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299465006_respuesta_009.jpg
10	12	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738299466290_respuesta_010.jpg
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                               5213.dat                                                                                            0000600 0004000 0002000 00000000156 14753722170 0014256 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	2	1	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738279957191_ciencias.jpg
\.


                                                                                                                                                                                                                                                                                                                                                                                                                  5201.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014244 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5203.dat                                                                                            0000600 0004000 0002000 00000000051 14753722170 0014247 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2	2	triple puntuación
1	2	Bonus x2
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       5227.dat                                                                                            0000600 0004000 0002000 00000000005 14753722170 0014254 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5199.dat                                                                                            0000600 0004000 0002000 00000000005 14753722171 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5197.dat                                                                                            0000600 0004000 0002000 00000000132 14753722171 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	6	Ruleta de turno	00:00:40
2	6	Ruleta comodín	00:01:00
3	6	Ruleta áreas	00:00:40
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                      5215.dat                                                                                            0000600 0004000 0002000 00000000005 14753722171 0014252 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5217.dat                                                                                            0000600 0004000 0002000 00000000332 14753722171 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2	1	2	10	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738270934041_ciencias.jpg
3	1	2	12	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738271764007_mate2.jpg
\.


                                                                                                                                                                                                                                                                                                      5175.dat                                                                                            0000600 0004000 0002000 00000000011 14753722171 0014254 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	3
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       5173.dat                                                                                            0000600 0004000 0002000 00000000011 14753722171 0014252 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       5219.dat                                                                                            0000600 0004000 0002000 00000011007 14753722171 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        30	4	trivia	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739302207471_sorteo trivia.mp4	\N
1	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
5	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
6	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
2	4	Presentación Participantes	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300521197_participantes.mp4	2025-02-11 14:02:07.33561
8	4	Presentación Participantes	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300521197_participantes.mp4	2025-02-11 14:02:07.33561
17	4	Presentación Participantes	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300521197_participantes.mp4	2025-02-11 14:02:07.33561
25	4	Presentación Participantes	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300521197_participantes.mp4	2025-02-11 14:02:07.33561
3	4	Formato Sorteo Trivia	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300562351_sorteo trivia.mp4	2025-02-11 14:02:46.49804
16	4	Formato Sorteo Trivia	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300562351_sorteo trivia.mp4	2025-02-11 14:02:46.49804
26	4	Formato Sorteo Trivia	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300562351_sorteo trivia.mp4	2025-02-11 14:02:46.49804
4	4	Formato Sorteo Desafío	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300581628_sorteo desafio.mp4	2025-02-11 14:03:08.011301
7	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
9	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
10	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
23	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
24	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
28	4	opening	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739333347427_opening.mp4	2025-02-11 23:09:10.123119
27	4	Opening Olimpiadass	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739300369602_opening.mp4	\N
29	4	presentacion	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739333491790_participantes.mp4	2025-02-11 23:11:36.653219
31	4	desafio	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739302403257_sorteo desafio.mp4	\N
11	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
12	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
13	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
14	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
15	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
18	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
19	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
20	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
21	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
22	4	Opening Olimpiadas	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1739303502586_opening.mp4	2025-02-11 14:51:45.277082
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         5221.dat                                                                                            0000600 0004000 0002000 00000000005 14753722171 0014247 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           5223.dat                                                                                            0000600 0004000 0002000 00000001235 14753722171 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	3	opening	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738285182473_playa1.mp4	2025-01-30 19:59:43.857001
2	3	playa	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738290959721_playa12.mp4	2025-01-30 21:36:01.49803
4	3	playa2	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738291758067_playa13.mp4	2025-01-30 21:49:19
5	3	playa23	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738291766087_playa13.mp4	2025-01-30 21:49:27
3	3	OpeningE	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738291663519_playa13.mp4	2025-01-31 02:47:44.949
\.


                                                                                                                                                                                                                                                                                                                                                                   5225.dat                                                                                            0000600 0004000 0002000 00000000417 14753722171 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	4	aaa	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738292417747_playa13.mp4	2025-01-30 22:00:19.446414
2	4	OYE	https://storage.googleapis.com/trivia-1ac56.firebasestorage.app/uploads/1738292700264_playa13.mp4	2025-01-30 22:05:01.745619
\.


                                                                                                                                                                                                                                                 restore.sql                                                                                         0000600 0004000 0002000 00000042101 14753722171 0015373 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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

DROP DATABASE trivia;
--
-- Name: trivia; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE trivia WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE trivia OWNER TO postgres;

\connect trivia

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

--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.areas (id_area, nombre_area, img_area) FROM stdin;
\.
COPY public.areas (id_area, nombre_area, img_area) FROM '$$PATH$$/5177.dat';

--
-- Data for Name: configuracion_desafio_mate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_desafio_mate (id_configuracion_desa, id_desafio, nombre_configuracion) FROM stdin;
\.
COPY public.configuracion_desafio_mate (id_configuracion_desa, id_desafio, nombre_configuracion) FROM '$$PATH$$/5183.dat';

--
-- Data for Name: configuracion_general; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_general (id_configuracion, nombre_configuracion) FROM stdin;
\.
COPY public.configuracion_general (id_configuracion, nombre_configuracion) FROM '$$PATH$$/5181.dat';

--
-- Data for Name: configuracion_trivia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_trivia (id_configuracion, id_trivia, nombre_configuracion) FROM stdin;
\.
COPY public.configuracion_trivia (id_configuracion, id_trivia, nombre_configuracion) FROM '$$PATH$$/5185.dat';

--
-- Data for Name: desafio_matematico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.desafio_matematico (id_desafio, id_modulo, intro_video_url, banner_url, tiempo_ruleta) FROM stdin;
\.
COPY public.desafio_matematico (id_desafio, id_modulo, intro_video_url, banner_url, tiempo_ruleta) FROM '$$PATH$$/5179.dat';

--
-- Data for Name: efectos_especiales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.efectos_especiales (id_efectos_especiales, id_configuracion, nombre, url_efectos) FROM stdin;
\.
COPY public.efectos_especiales (id_efectos_especiales, id_configuracion, nombre, url_efectos) FROM '$$PATH$$/5229.dat';

--
-- Data for Name: estado_partida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_partida (id_estado, id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul, contador_preguntas, puntos_equipo_rojo, puntos_equipo_azul) FROM stdin;
\.
COPY public.estado_partida (id_estado, id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul, contador_preguntas, puntos_equipo_rojo, puntos_equipo_azul) FROM '$$PATH$$/5205.dat';

--
-- Data for Name: explicaciones_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.explicaciones_area (id_explicacion, id_pregunta, url_img_explicacion) FROM stdin;
\.
COPY public.explicaciones_area (id_explicacion, id_pregunta, url_img_explicacion) FROM '$$PATH$$/5191.dat';

--
-- Data for Name: instituciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instituciones (id_institucion, nombre_institucion) FROM stdin;
\.
COPY public.instituciones (id_institucion, nombre_institucion) FROM '$$PATH$$/5187.dat';

--
-- Data for Name: modulo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modulo (id_modulo, nombre_modulo) FROM stdin;
\.
COPY public.modulo (id_modulo, nombre_modulo) FROM '$$PATH$$/5171.dat';

--
-- Data for Name: pagina_principal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagina_principal (id_pagina, id_configuracion, url_fondo_principal) FROM stdin;
\.
COPY public.pagina_principal (id_pagina, id_configuracion, url_fondo_principal) FROM '$$PATH$$/5233.dat';

--
-- Data for Name: preguntas_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas_area (id_pregunta, id_area, url_img_pregunta) FROM stdin;
\.
COPY public.preguntas_area (id_pregunta, id_area, url_img_pregunta) FROM '$$PATH$$/5189.dat';

--
-- Data for Name: preguntas_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas_desafio (id_pregunta_desafio, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM stdin;
\.
COPY public.preguntas_desafio (id_pregunta_desafio, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM '$$PATH$$/5207.dat';

--
-- Data for Name: preguntas_desafio_publico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas_desafio_publico (id_pregunta_desafio_publico, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM stdin;
\.
COPY public.preguntas_desafio_publico (id_pregunta_desafio_publico, id_configuracion_desa, url_img_pregunta, respuesta_correcta_url) FROM '$$PATH$$/5231.dat';

--
-- Data for Name: preguntas_publico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas_publico (id_pregunta_publico, id_configuracion, url_img_pregunta_publico) FROM stdin;
\.
COPY public.preguntas_publico (id_pregunta_publico, id_configuracion, url_img_pregunta_publico) FROM '$$PATH$$/5209.dat';

--
-- Data for Name: publicidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publicidad (id_publicidad, id_configuracion, nombre_video_foto, url_video_foto) FROM stdin;
\.
COPY public.publicidad (id_publicidad, id_configuracion, nombre_video_foto, url_video_foto) FROM '$$PATH$$/5193.dat';

--
-- Data for Name: reloj; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reloj (id_reloj, id_configuracion, tiempo) FROM stdin;
\.
COPY public.reloj (id_reloj, id_configuracion, tiempo) FROM '$$PATH$$/5195.dat';

--
-- Data for Name: respuestas_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respuestas_area (id_respuesta, id_pregunta, url_img_respuesta) FROM stdin;
\.
COPY public.respuestas_area (id_respuesta, id_pregunta, url_img_respuesta) FROM '$$PATH$$/5211.dat';

--
-- Data for Name: respuestas_publico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respuestas_publico (id_respuesta_publico, id_configuracion, id_pregunta_publico, url_img_respuesta_publico) FROM stdin;
\.
COPY public.respuestas_publico (id_respuesta_publico, id_configuracion, id_pregunta_publico, url_img_respuesta_publico) FROM '$$PATH$$/5213.dat';

--
-- Data for Name: ruleta_areas_detalles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruleta_areas_detalles (id_ruleta_areas_detalles, id_ruletas, id_area) FROM stdin;
\.
COPY public.ruleta_areas_detalles (id_ruleta_areas_detalles, id_ruletas, id_area) FROM '$$PATH$$/5201.dat';

--
-- Data for Name: ruleta_comodin_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruleta_comodin_detalle (id_ruleta_comodin_detalle, id_ruletas, texto_comodin) FROM stdin;
\.
COPY public.ruleta_comodin_detalle (id_ruleta_comodin_detalle, id_ruletas, texto_comodin) FROM '$$PATH$$/5203.dat';

--
-- Data for Name: ruleta_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruleta_desafio (id_ruleta_desafio, id_configuracion_desa, texto, url_logo, tiempo) FROM stdin;
\.
COPY public.ruleta_desafio (id_ruleta_desafio, id_configuracion_desa, texto, url_logo, tiempo) FROM '$$PATH$$/5227.dat';

--
-- Data for Name: ruleta_turno_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruleta_turno_detalle (id_ruleta_turno_detalle, id_ruletas, texto, url_logo) FROM stdin;
\.
COPY public.ruleta_turno_detalle (id_ruleta_turno_detalle, id_ruletas, texto, url_logo) FROM '$$PATH$$/5199.dat';

--
-- Data for Name: ruletas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruletas (id_ruletas, id_configuracion, tipo_ruleta, tiempo) FROM stdin;
\.
COPY public.ruletas (id_ruletas, id_configuracion, tipo_ruleta, tiempo) FROM '$$PATH$$/5197.dat';

--
-- Data for Name: sorteo_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sorteo_desafio (id_sorteo_desafio, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_desafio) FROM stdin;
\.
COPY public.sorteo_desafio (id_sorteo_desafio, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_desafio) FROM '$$PATH$$/5215.dat';

--
-- Data for Name: sorteo_trivia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sorteo_trivia (id_sorteo_trivia, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_trivia) FROM stdin;
\.
COPY public.sorteo_trivia (id_sorteo_trivia, id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_trivia) FROM '$$PATH$$/5217.dat';

--
-- Data for Name: sorteos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sorteos (id_sorteos, id_modulo) FROM stdin;
\.
COPY public.sorteos (id_sorteos, id_modulo) FROM '$$PATH$$/5175.dat';

--
-- Data for Name: trivia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trivia (id_trivia, id_modulo) FROM stdin;
\.
COPY public.trivia (id_trivia, id_modulo) FROM '$$PATH$$/5173.dat';

--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos (id_video, id_configuracion, nombre_video, url_video, fecha_subida) FROM stdin;
\.
COPY public.videos (id_video, id_configuracion, nombre_video, url_video, fecha_subida) FROM '$$PATH$$/5219.dat';

--
-- Data for Name: videos_desafio_mate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos_desafio_mate (id_video_desafio, id_configuracion_desa, nombre_video_desafio, url_video_desafio, fecha_subida) FROM stdin;
\.
COPY public.videos_desafio_mate (id_video_desafio, id_configuracion_desa, nombre_video_desafio, url_video_desafio, fecha_subida) FROM '$$PATH$$/5221.dat';

--
-- Data for Name: videos_trivia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos_trivia (id_video_trivia, id_configuracion, nombre_video_trivia, url_video_trivia, fecha_subida) FROM stdin;
\.
COPY public.videos_trivia (id_video_trivia, id_configuracion, nombre_video_trivia, url_video_trivia, fecha_subida) FROM '$$PATH$$/5223.dat';

--
-- Data for Name: videos_trivia_comodin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos_trivia_comodin (id_video_trivia_comodin, id_configuracion, nombre_video_trivia_comodin, url_video_trivia_comodin, fecha_subida) FROM stdin;
\.
COPY public.videos_trivia_comodin (id_video_trivia_comodin, id_configuracion, nombre_video_trivia_comodin, url_video_trivia_comodin, fecha_subida) FROM '$$PATH$$/5225.dat';

--
-- Name: areas_id_area_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.areas_id_area_seq', 4, true);


--
-- Name: configuracion_desafio_mate_id_configuracion_desa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_desafio_mate_id_configuracion_desa_seq', 1, false);


--
-- Name: configuracion_general_id_configuracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_general_id_configuracion_seq', 4, true);


--
-- Name: configuracion_trivia_id_configuracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_trivia_id_configuracion_seq', 6, true);


--
-- Name: desafio_matematico_id_desafio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desafio_matematico_id_desafio_seq', 1, false);


--
-- Name: efectos_especiales_id_efectos_especiales_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.efectos_especiales_id_efectos_especiales_seq', 1, true);


--
-- Name: estado_partida_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_partida_id_estado_seq', 1, false);


--
-- Name: explicaciones_area_id_explicacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.explicaciones_area_id_explicacion_seq', 10, true);


--
-- Name: instituciones_id_institucion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instituciones_id_institucion_seq', 4, true);


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modulo_id_modulo_seq', 4, true);


--
-- Name: pagina_principal_id_pagina_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagina_principal_id_pagina_seq', 1, false);


--
-- Name: preguntas_area_id_pregunta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preguntas_area_id_pregunta_seq', 12, true);


--
-- Name: preguntas_desafio_id_pregunta_desafio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preguntas_desafio_id_pregunta_desafio_seq', 1, false);


--
-- Name: preguntas_desafio_publico_id_pregunta_desafio_publico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preguntas_desafio_publico_id_pregunta_desafio_publico_seq', 1, false);


--
-- Name: preguntas_publico_id_pregunta_publico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preguntas_publico_id_pregunta_publico_seq', 1, true);


--
-- Name: publicidad_id_publicidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publicidad_id_publicidad_seq', 4, true);


--
-- Name: reloj_id_reloj_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reloj_id_reloj_seq', 82, true);


--
-- Name: respuestas_area_id_respuesta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respuestas_area_id_respuesta_seq', 10, true);


--
-- Name: respuestas_publico_id_respuesta_publico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respuestas_publico_id_respuesta_publico_seq', 1, true);


--
-- Name: ruleta_areas_detalles_id_ruleta_areas_detalles_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruleta_areas_detalles_id_ruleta_areas_detalles_seq', 1, false);


--
-- Name: ruleta_comodin_detalle_id_ruleta_comodin_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruleta_comodin_detalle_id_ruleta_comodin_detalle_seq', 2, true);


--
-- Name: ruleta_desafio_id_ruleta_desafio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruleta_desafio_id_ruleta_desafio_seq', 1, false);


--
-- Name: ruleta_turno_detalle_id_ruleta_turno_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruleta_turno_detalle_id_ruleta_turno_detalle_seq', 1, false);


--
-- Name: ruletas_id_ruletas_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruletas_id_ruletas_seq', 4, true);


--
-- Name: sorteo_desafio_id_sorteo_desafio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sorteo_desafio_id_sorteo_desafio_seq', 1, false);


--
-- Name: sorteo_trivia_id_sorteo_trivia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sorteo_trivia_id_sorteo_trivia_seq', 3, true);


--
-- Name: sorteos_id_sorteos_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sorteos_id_sorteos_seq', 1, true);


--
-- Name: trivia_id_trivia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trivia_id_trivia_seq', 1, true);


--
-- Name: videos_desafio_mate_id_video_desafio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_desafio_mate_id_video_desafio_seq', 1, false);


--
-- Name: videos_id_video_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_id_video_seq', 31, true);


--
-- Name: videos_trivia_comodin_id_video_trivia_comodin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_trivia_comodin_id_video_trivia_comodin_seq', 2, true);


--
-- Name: videos_trivia_id_video_trivia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_trivia_id_video_trivia_seq', 5, true);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               