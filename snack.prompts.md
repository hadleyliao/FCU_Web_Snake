# 規格書 (Specification)


## 1. 資料結構
- `snake`: 長度為 3 的陣列，每個元素為 `{ x: number, y: number }`
- `direction` 與 `nextDirection`: 目前移動向量 `{ x: -1|0|1, y: -1|0|1 }`
- `food`: `{ x: number, y: number }`
- `score`: 分數（整數）
- `speed`: 遊戲更新間隔（毫秒）
- `gameInterval`: `setInterval` 回傳值
- `isRunning`: 遊戲是否進行中（布林值）

## 2. 地圖繪製
- 在 `#gameBoard` 中動態建立 `GRID_SIZE × GRID_SIZE` (30×30) 個格子
- 每格使用 `<div class="cell" data-x="…" data-y="…">`

## 3. 鍵盤控制
- 監聽 `window` 的 `keydown` 事件
- 支援 `ArrowUp`、`ArrowDown`、`ArrowLeft`、`ArrowRight`
- 禁止蛇瞬間 180° 轉向 (`newDir.x + direction.x !== 0 || newDir.y + direction.y !== 0`)

## 4. 食物產生
- 隨機落在地圖範圍內：`x, y ∈ [0, GRID_SIZE)`
- 在對應格子加上 `food` class

## 5. 吃食物與蛇身變長
- 每次更新時檢查蛇頭座標是否與 `food` 相同
- 相同者：
    - `score++`
    - 更新畫面上的分數
    - 重新產生 `food`
    - `speed = max(10, speed - 2)` 並重設 `setInterval`
    - 不移除尾部，使蛇身長度 +1

## 6. 碰撞判定
- 6.1 碰撞牆壁
  - 當蛇頭座標滿足 `head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE`
  - 停止遊戲：`clearInterval(gameInterval)`、`isRunning = false`、跳出「Game Over」提示
- 6.2 自身碰撞
  - 移動後若新蛇頭座標與 `snake` 陣列中任一節點相同
  - 停止遊戲：`clearInterval(gameInterval)`、`isRunning = false`、跳出「Game Over」提示

## 7. 重新開始按鈕
- 按鈕 `#startBtn` 綁定 `startGame()`
- 重置：
    - `initBoard()`、`snake`、`direction`、`nextDirection`、`food`、`score`、`speed`、`isRunning`
    - 更新分數顯示
    - 啟動 `gameInterval`

## 8. 暫停遊戲
- 按鈕 `#pauseBtn` 綁定 `togglePause()`
- 若正在跑：`clearInterval(gameInterval)`、`gameInterval = null`
- 若已暫停：重設 `setInterval(gameLoop, speed)`