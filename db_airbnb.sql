USE `db_airbnb`;

SET NAMES utf8mb4;


CREATE TABLE `DatPhong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ngay_den` datetime DEFAULT NULL,
  `ngay_di` datetime DEFAULT NULL,
  `so_luong_khach` int DEFAULT NULL,
  `ma_nguoi_dat` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_nguoi_dat` (`ma_nguoi_dat`),
  KEY `ma_phong` (`ma_phong`),
  CONSTRAINT `DatPhong_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
  CONSTRAINT `DatPhong_ibfk_2` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `NguoiDung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`) VALUES
(1,	1,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	6,	1),
(2,	2,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	5,	2),
(3,	3,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	2,	3),
(4,	4,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	2,	4),
(5,	5,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	7,	6),
(6,	6,	'2022-12-07 00:00:00',	'2022-12-20 00:00:00',	2,	11),
(7,	7,	'2023-01-01 00:00:00',	'2023-01-22 00:00:00',	3,	8),
(8,	8,	'2023-01-01 00:00:00',	'2023-01-22 00:00:00',	2,	13),
(9,	9,	'2023-01-01 00:00:00',	'2023-01-22 00:00:00',	6,	14),
(10,	5,	'2023-01-08 00:00:00',	'2023-01-10 00:00:00',	2,	10),
(11,	4,	'2023-01-09 00:00:00',	'2023-01-11 00:00:00',	5,	9),
(12,	8,	'2023-01-10 00:00:00',	'2023-01-15 00:00:00',	3,	12);

CREATE TABLE `NguoiDung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pass_word` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_day` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`) VALUES
(1,	'Vitoria',	'victoria@gmail.com',	'victoria123',	'0902123456',	'05-12-1969',	'female',	'admin',	NULL),
(2,	'Mina',	'mina@yahoo.com',	'minamina',	'0904234342',	'01-09-1996',	'female',	'user',	NULL),
(3,	'Vicky',	'vicky@yahoo.com',	'vicky',	'0909123145',	'03-10-1994',	'female',	'admin',	NULL),
(4,	'Beckham',	'beckham@edu.com',	'beckham4',	'0999123222',	'05-02-1975',	'male',	'admin',	NULL),
(5,	'Ronaldo',	'siuuu@alsaad.com',	'siuuuuu123',	'0707070707',	'02-05-1985',	'male',	'user',	NULL),
(6,	'Casemiro',	'casemiro@yahoo.com',	'casemiro456',	'0909111111',	'02-23-1992',	'male',	'user',	NULL),
(7,	'Rashford',	'rashford@gmail.com',	'rashford123',	'0909292929',	'10-31-1997',	'male',	'user',	NULL),
(8,	'Casemiro',	'casemiro@yahoo.com',	'casemiro456',	'0909111111',	'02-23-1992',	'male',	'user',	NULL),
(9,	'Haaland',	'haaland.com',	'haaland123',	'0707212121',	'07-21-2000',	'male',	'admin',	NULL),
(10,	'Dell',	'Dell@dell.com',	'dell12345',	'0393939393',	'01-01-1954',	'male',	'user',	NULL),
(11,	'ArynaS',	'Aryna@msi.com',	'aryna123',	'0949494953',	'05-05-1998',	'female',	'admin',	NULL),
(12,	'Asus',	'Asus@asus.com',	'asus1234',	'0902912345',	'01-01-1989',	'male',	'user',	NULL),
(13,	'Acer',	'MSI@msi.com',	'acer1234',	'0992213123',	'01-01-1979',	'male',	'user',	NULL),
(14,	'SerenaW',	'Serena@gmail.com',	'serena123',	'0949494953',	'01-01-1939',	'female',	'admin',	NULL),
(15,	'MSI',	'MSI@msi.com',	'msi12345',	'0949494953',	'01-01-1939',	'male',	'user',	NULL);

CREATE TABLE `ViTri` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_vi_tri` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tinh_thanh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoc_gia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`) VALUES
(1,	'Ho Chi Minh City',	'Ho Chi Minh',	'Việt Nam',	'https://a0.muscache.com/im/pictures/d01fdd4a-4021-476c-a51e-450d6eb46181.jpg?im_w=1200'),
(2,	'Da Lat',	'Lam Dong',	'Việt Nam',	'https://a0.muscache.com/im/pictures/miso/Hosting-817692500264056772/original/4bba3fb2-b11b-4c55-90f5-4f9b4e6e33f9.jpeg?im_w=1440'),
(3,	'Vung Tau',	'Ba Ria',	'Viet Nam',	'https://a0.muscache.com/im/pictures/miso/Hosting-545989934801304825/original/1f7019ab-e4b5-4bb7-85b8-ce244326b53c.jpeg?im_w=1200'),
(4,	'Bac Giang',	'Bac Giang',	'Viet Nam',	'https://a0.muscache.com/im/pictures/e08a218a-f1ff-427f-bc6c-6ce25e485ef5.jpg?im_w=1200'),
(5,	'Kon Tum',	'Kon Tum',	'Viet Nam',	'https://a0.muscache.com/im/pictures/dc2b4252-c317-405b-9511-06f2eec29a57.jpg?im_w=720'),
(6,	'Pleiku',	'Gia Lai',	'Viet Nam',	'https://a0.muscache.com/im/pictures/ff2093ab-0017-47ca-99a8-6a499b23c30e.jpg?im_w=720'),
(7,	'Tan Giang',	'Ha Giang',	'Viet Nam',	'https://a0.muscache.com/im/pictures/37e36334-55f1-454e-84be-16b7c885102c.jpg?im_w=720'),
(8,	'Ha Noi',	'Ha Noi',	'Viet Nam',	'https://a0.muscache.com/im/pictures/miso/Hosting-770114124318740715/original/bcf11488-b3b9-4b51-9796-b72e4eca7f73.jpeg?im_w=720'),
(9,	'Auckland City',	'Auckland',	'New Zealand',	'https://a0.muscache.com/im/pictures/8eef7d70-e3d8-4a69-bf20-91378325d932.jpg?im_w=1440'),
(10,	'London City',	'London',	'United Kingdom',	'https://a0.muscache.com/im/pictures/ec2c4be3-cf0a-4eaa-ab30-3e2016a5149e.jpg?im_w=1200'),
(11,	'Manchester',	'Greater Manchester',	'United Kingdom',	'https://a0.muscache.com/im/pictures/3a9f3d87-20c8-4e65-8ba4-3ebf85df1bc0.jpg?im_w=1440'),
(12,	'Tokyo',	'Kantō',	'Japan',	'https://a0.muscache.com/im/pictures/413464d8-66ea-4d9c-831e-588f2797f56c.jpg?im_w=1200'),
(13,	'Seoul City',	'Seoul',	'Korea',	'https://a0.muscache.com/im/pictures/miso/Hosting-51891880/original/1651de2d-08d2-4e30-974b-a238097038b9.jpeg?im_w=1200'),
(14,	'Toronto',	'Ontario',	'Canada',	'https://a0.muscache.com/im/pictures/21e07620-05b9-48de-abd8-17c3a3281301.jpg?im_w=1200'),
(15,	'Cape Breton',	'Nova Scotia',	'Canada',	'https://a0.muscache.com/im/pictures/c371d436-d4c6-42b6-8bde-ff8e98bac29e.jpg?im_w=1200'),
(16,	'Paris City',	'Paris',	'France',	'https://a0.muscache.com/im/pictures/b1cc348d-d8f0-44f5-8184-274fd4123243.jpg?im_w=1200'),
(17,	'Nice',	'Nice',	'France',	'https://a0.muscache.com/im/pictures/90e0fd39-fe70-4017-95f7-9faf0d38ea9f.jpg?im_w=1200'),
(18,	'Fox Glacier',	'West Coast',	'New Zealand',	'https://a0.muscache.com/im/pictures/1d1827b8-b415-45c1-9922-937430c4ec85.jpg?im_w=1200');

CREATE TABLE `Phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_phong` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `khach` int DEFAULT NULL,
  `phong_ngu` int DEFAULT NULL,
  `giuong` int DEFAULT NULL,
  `phong_tam` int DEFAULT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia_tien` int DEFAULT NULL,
  `may_giat` tinyint(1) DEFAULT NULL,
  `ban_la` tinyint(1) DEFAULT NULL,
  `tivi` tinyint(1) DEFAULT NULL,
  `dieu_hoa` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `bep` tinyint(1) DEFAULT NULL,
  `do_xe` tinyint(1) DEFAULT NULL,
  `ho_boi` tinyint(1) DEFAULT NULL,
  `ban_ui` tinyint(1) DEFAULT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ma_vi_tri` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_vi_tri` (`ma_vi_tri`),
  CONSTRAINT `Phong_ibfk_1` FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`) VALUES
(1,	'2212 Cozy 1BR Apt Rooftop Pool ICON56',	4,	1,	1,	1,	'The cozy Condo full furniture 45m2 with 1 bedroom 1 bathroom, have kitchen, washer, free wifi',	33,	1,	1,	1,	1,	1,	1,	1,	1,	1,	'https://a0.muscache.com/im/pictures/d01fdd4a-4021-476c-a51e-450d6eb46181.jpg?im_w=1200',	1),
(2,	'DreamLakeDalat',	2,	1,	1,	1,	'A private fully furnished bungalow, surrounded by a green garden. The premise locates in the heart of the city but still provides stunning sunset view. Ít closes to everything, perfect to plan your visit',	26,	1,	1,	0,	1,	1,	1,	1,	0,	0,	'https://a0.muscache.com/im/pictures/3fed4291-897a-4706-b18f-5defed6369ea.jpg?im_w=1200',	2),
(3,	'Milan 51 - 2 bedroom The Song Apartment',	5,	2,	2,	1,	'Your family will be close to everything when you stay at this centrally-located place.',	36,	1,	1,	1,	1,	1,	1,	1,	1,	1,	'https://a0.muscache.com/im/pictures/miso/Hosting-680319079152503519/original/952f2a1c-7b0a-448e-aed7-915c176e7b49.jpeg?im_w=1200',	3),
(4,	'PENTSTUDIO★LUXURY★NETFLIX-PROJECTOR',	5,	1,	1,	2,	'West Lake area penthouse with paranomic view of the lake and Red River. Conveniently located within 20 mins from both city centre and Noi Bai airport.',	51,	1,	1,	1,	1,	1,	1,	1,	0,	1,	'https://a0.muscache.com/im/pictures/08cb92cf-bf38-4b9b-8f7e-1dee9d791828.jpg?im_w=1200',	8),
(5,	'Luxurious 2 Bedroom Apartment - Central Manchester',	6,	2,	2,	2,	'A truly stunning 2 bedroom apartment available in Manchester’s most iconic building Beetham Tower.',	228,	1,	1,	1,	1,	1,	1,	0,	0,	1,	'https://a0.muscache.com/im/pictures/miso/Hosting-53578482/original/d7559436-98dc-4bee-ad4e-037a7f3d405b.jpeg?im_w=720',	11),
(6,	'1 Bed + Den, 2 Bath in the Entertainment district',	6,	2,	2,	2,	'Enjoy the Beautiful Charlie Condos in the Heart of the Entertainment District. This unit has every amenity you can imagine.',	362,	1,	1,	0,	1,	1,	1,	0,	0,	1,	'https://a0.muscache.com/im/pictures/miso/Hosting-651683825396666220/original/122b926c-d3f2-47a3-8e38-49b0108e9abc.jpeg?im_w=1200',	14),
(7,	'One-bedroom unit in garden setting',	2,	1,	1,	1,	'This one-bedroom unit is situated on spacious grounds in a picturesque garden setting with beautiful mountain views. ',	89,	1,	1,	1,	1,	1,	1,	1,	0,	1,	'https://a0.muscache.com/im/pictures/1d1827b8-b415-45c1-9922-937430c4ec85.jpg?im_w=1200',	18),
(8,	'Clean double room with own bathroom',	2,	1,	1,	1,	'Double room in 2 bedroom shared apartment in wonderfully central London location close to Victoria station and Pimlico. Clean and spacious apartment,  owner often away. ',	145,	1,	1,	1,	1,	1,	1,	0,	0,	1,	'https://a0.muscache.com/im/pictures/pro_photo_tool/Hosting-12341282-unapproved/original/a02751de-5af3-4f61-9cc8-880f833ae0cb.JPEG?im_w=720',	10),
(9,	'Magnificent views in CBD with free parking',	4,	2,	2,	2,	'Central Auckland location with 5 minute walking distance to commercial bay, sky city and supermarkets.',	125,	1,	1,	1,	1,	1,	1,	0,	0,	1,	'https://a0.muscache.com/im/pictures/0767fc1f-69b2-4e51-8fe6-6ab8efe2b4b3.jpg?im_w=1200',	9);


CREATE TABLE `BinhLuan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ma_nguoi_binh_luan` int DEFAULT NULL,
  `ngay_binh_luan` datetime DEFAULT NULL,
  `noi_dung` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sao_binh_luan` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_nguoi_binh_luan` (`ma_nguoi_binh_luan`),
  KEY `ma_phong` (`ma_phong`),
  CONSTRAINT `BinhLuan_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
  CONSTRAINT `BinhLuan_ibfk_2` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `NguoiDung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`) VALUES
(1,	6,	2,	'2023-12-12 00:00:00',	'The host makes my day, she was nice and adorable',	9),
(2,	7,	1,	'2023-09-12 00:00:00',	'Nice views with great host',	8),
(3,	8,	3,	'2023-11-12 00:00:00',	'High price but dirty room',	2),
(4,	1,	4,	'2023-07-07 00:00:00',	'Incroyable et spacieuse',	10),
(6,	3,	5,	'2023-08-06 00:00:00',	'Little bit dirty but strong wifi',	7),
(8,	4,	6,	'2023-08-08 00:00:00',	'The owners are superb, will visit them again',	10),
(9,	5,	9,	'2023-09-09 00:00:00',	'Great view and kitchen is well cleaned',	8),
(10,	2,	3,	'2023-05-05 00:00:00',	'Staff was rude when customer complained about hair, did not agree to change room.',	1),
(11,	5,	2,	'2022-09-09 00:00:00',	'lovely host, interesting experience',	9),
(12,	9,	3,	'2022-09-02 00:00:00',	'I will stay again',	8),
(13,	7,	5,	'2023-09-20 00:00:00',	'this was such a wonderful place to stay',	10),
(14,	3,	6,	'2023-10-20 00:00:00',	'Disappointed',	1),
(15,	4,	3,	'2022-02-09 00:00:00',	'nice and lovely host',	10),
(16,	2,	6,	'2023-10-10 00:00:00',	'This will be on my bucket list next time I visit Vietnam',	8),
(17,	9,	6,	'2023-10-10 00:00:00',	'Traffic is so bad but the room is nice, great location',	7);

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('776a9a51-aece-4e85-b28a-90ee6c819610',	'04ddbf28c14d28f7dce6b54deb001b93360157df205e13e100a86effdd3a73c4',	'2023-02-24 17:46:12.899',	'20230224174612_init',	NULL,	NULL,	'2023-02-24 17:46:12.576',	1);