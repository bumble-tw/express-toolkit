## [1.1.0] - 2024-02-03

### Added

- 新增驗證 isDate 功能。

### Fixed

- 驗證 email 現在會強制將 return 轉換成 lowercase。

## [1.2.0] - 2024-02-03

### Added

- 新增驗證 isPostalCode 功能。

## [1.2.1] - 2024-02-04

### modified

- 日期驗證增加最大最小驗證。

## [1.2.2] - 2024-02-05

### modified

- byPassQuery 改成可以自定義欲移除的屬性。

## [1.3.0] - 2024-03-22

### Added

- localApi 增加自訂義 agent 參數輸入選項。

## [1.4.0] - 2024-03-29

### Added

- LocalApiService 增加 returnFullResponse 參數。

## [1.4.1] - 2024-03-29

### Fixed

- sendLocalApiData 中 configureAxios 參數載入錯誤 bug

## [1.5.0] - 2024-04-10

### Feature

- validator
  - 增加自訂錯誤訊息。
  - 密碼特殊符號改成不強制輸入，且只允許特殊範圍。

## [1.5.1] - 2024-04-12

### Fixed

- sendEmail Options 設定錯誤。

## [1.6.0] - 2024-04-16

### Feature

- 寄件系統新增 https proxy 設定條件

## [1.6.1] - 2024-04-19

### Feature

- 數字驗證增加最大值最小值參數。

## [1.6.2] - 2024-04-20

### Fixed

- 修正寄信套件使用錯誤問題。

## [1.6.3] - 2024-04-20

### Fixed

- CF 使用到的套件為正確安裝問題。

## [1.6.4] - 2024-04-20

### Fixed

- 修正 validator 監測不到輸入陣列為 undefined 的情形。

## [1.6.5] - 2024-05-08

### Fixed

- 修正 validator 允許空值時，也要可以允許空字串。

### [1.6.6] - 2024-06-16

- 修正會以累加的方式一直新增與 Redis 的連線。
- 關閉連線失敗時，會無限迴圈式的重新嘗試連線。
- Redis 連線改為使用 Redis 功能時檢查是否已建立連線，若已建立會直接使用建立中的連線。
- Redis 連線失敗，會改成將資料儲存在緩存中，避免服務因此崩潰。
- Redis 工具增加一些參數功能。

### [1.6.7] - 2024-06-16

- 修正 Redis 設定的值為整數 0 時，會被當成 falsy 的錯誤

### [1.6.8] - 2024-07-22

- validators 加入 isUrl 的檢測功能

### [1.7.0] - 2024-08-01

- 信箱加入 SSL 功能

### [1.7.1] - 2024-08-02

- 信箱加入以下功能
  - S/MIME
  - DKIM
  - SSL
  - STARTTLS
  - HTTP/HTTPS Agent

### [1.7.2] - 2024-08-02

- 信箱修正當 TRANSPORTS_PROXY 為空字串時會出現錯誤的問題

### [1.7.3] - 2024-08-02

- 信箱修正transporter宣告順序的問題
