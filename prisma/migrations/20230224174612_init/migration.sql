-- CreateTable
CREATE TABLE `BinhLuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_phong` INTEGER NULL,
    `ma_nguoi_binh_luan` INTEGER NULL,
    `ngay_binh_luan` DATETIME(0) NULL,
    `noi_dung` VARCHAR(255) NULL,
    `sao_binh_luan` INTEGER NULL,

    INDEX `ma_nguoi_binh_luan`(`ma_nguoi_binh_luan`),
    INDEX `ma_phong`(`ma_phong`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatPhong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_phong` INTEGER NULL,
    `ngay_den` DATETIME(0) NULL,
    `ngay_di` DATETIME(0) NULL,
    `so_luong_khach` INTEGER NULL,
    `ma_nguoi_dat` INTEGER NULL,

    INDEX `ma_nguoi_dat`(`ma_nguoi_dat`),
    INDEX `ma_phong`(`ma_phong`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NguoiDung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `pass_word` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `birth_day` VARCHAR(255) NULL,
    `gender` VARCHAR(255) NULL,
    `role` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_phong` VARCHAR(255) NULL,
    `khach` INTEGER NULL,
    `phong_ngu` INTEGER NULL,
    `giuong` INTEGER NULL,
    `phong_tam` INTEGER NULL,
    `mo_ta` VARCHAR(255) NULL,
    `gia_tien` INTEGER NULL,
    `may_giat` BOOLEAN NULL,
    `ban_la` BOOLEAN NULL,
    `tivi` BOOLEAN NULL,
    `dieu_hoa` BOOLEAN NULL,
    `wifi` BOOLEAN NULL,
    `bep` BOOLEAN NULL,
    `do_xe` BOOLEAN NULL,
    `ho_boi` BOOLEAN NULL,
    `ban_ui` BOOLEAN NULL,
    `hinh_anh` VARCHAR(255) NULL,
    `ma_vi_tri` INTEGER NULL,

    INDEX `ma_vi_tri`(`ma_vi_tri`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ViTri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_vi_tri` VARCHAR(255) NULL,
    `tinh_thanh` VARCHAR(255) NULL,
    `quoc_gia` VARCHAR(255) NULL,
    `hinh_anh` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_ibfk_2` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `NguoiDung`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DatPhong` ADD CONSTRAINT `DatPhong_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DatPhong` ADD CONSTRAINT `DatPhong_ibfk_2` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `NguoiDung`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Phong` ADD CONSTRAINT `Phong_ibfk_1` FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
