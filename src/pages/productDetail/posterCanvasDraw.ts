/**
 * 行程/活动分享海报 — Canvas 2d 绘制（逻辑尺寸 640×1000，与弹窗结构对应）
 */

export const POSTER_WIDTH = 640
export const POSTER_HEIGHT = 1000

export interface PosterCanvasData {
  avatarUrl: string
  nickname: string
  coverUrl: string
  title: string
  address: string
  priceText: string
  /** 海报底部二维码图片地址（与弹窗一致） */
  qrCodeUrl?: string
}

const BG_URL = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/bg.png'
const TAG_URL = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/t02.png'
const T01_URL = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/t01.png'

/** 网络图转本地临时路径（小程序 canvas 绘制更稳） */
export async function downloadToTemp(url: string): Promise<string> {
  if (!url) return ''
  if (!url.startsWith('http')) return url
  const res = await new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
    uni.downloadFile({ url, success: resolve, fail: reject })
  })
  if (res.statusCode !== 200 || !res.tempFilePath) throw new Error('download image failed')
  return res.tempFilePath
}

function loadCanvasImage(canvas: any, src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage()
    img.onload = () => resolve(img)
    img.onerror = (e: unknown) => reject(e)
    img.src = src
  })
}

/** 简单按宽度折行（中文为主） */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  if (!text) return ['']
  const lines: string[] = []
  let line = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 4)
}

/**
 * 在已拿到 2d context 的 canvas 上绘制（需先设置 canvas.width/height 与 dpr scale）
 */
export async function drawPosterOnCanvas(
  canvas: any,
  ctx: CanvasRenderingContext2D,
  data: PosterCanvasData,
): Promise<void> {
  const w = POSTER_WIDTH
  const h = POSTER_HEIGHT

  const [bgPath, tagPath, coverPath, t01Path, avatarPath] = await Promise.all([
    downloadToTemp(BG_URL),
    downloadToTemp(TAG_URL),
    downloadToTemp(data.coverUrl),
    downloadToTemp(T01_URL),
    downloadToTemp(data.avatarUrl),
  ])

  const [bgImg, tagImg, coverImg, t01Img, avatarImg] = await Promise.all([
    loadCanvasImage(canvas, bgPath),
    loadCanvasImage(canvas, tagPath),
    loadCanvasImage(canvas, coverPath),
    loadCanvasImage(canvas, t01Path),
    loadCanvasImage(canvas, avatarPath),
  ])

  let qrImg: any = null
  if (data.qrCodeUrl) {
    try {
      const qrPath = await downloadToTemp(data.qrCodeUrl)
      if (qrPath) {
        qrImg = await loadCanvasImage(canvas, qrPath)
      }
    } catch {
      // 二维码失败时仍画白底占位
    }
  }

  // 背景：上半区渐变（与 ProductDetailModal .top 高 860rpx 一致）
  const topSectionH = 860
  const grad = ctx.createLinearGradient(0, 0, 0, topSectionH)
  grad.addColorStop(0, '#ffeba4')
  grad.addColorStop(1, '#ffffff')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, topSectionH)

  // 底图框：与弹窗 .top{padding:60 40 20} + .bg{height:100%} 对齐 — 上 60、下 20，内高 780；整体相对旧版上移
  const pad = 48
  const innerW = w - pad * 2
  const topPadY = 60
  const topPadBottom = 20
  const bgY = topPadY
  const bgH = topSectionH - topPadY - topPadBottom
  ctx.drawImage(bgImg, pad, bgY, innerW, bgH)

  // 头像圆形
  const ax = pad + 48
  const ay = bgY + 48
  const r = 22
  ctx.save()
  ctx.beginPath()
  ctx.arc(ax + r, ay + r, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(avatarImg, ax, ay, r * 2, r * 2)
  ctx.restore()

  // 昵称
  ctx.fillStyle = '#1a1a1a'
  ctx.font = 'bold 28px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(data.nickname || '用户', ax + r * 2 + 16, ay + 8)

  // 角标
  ctx.drawImage(tagImg, w - pad - 185 - 20, bgY - 10, 185, 120)

  // 封面（aspectFill 近似；高度与弹窗 .cover height:400rpx 一致）
  const cx = pad + 48
  const userInfoH = 80
  const cy = ay + userInfoH
  const cw = innerW - 96
  const ch = 400
  drawImageCover(ctx, coverImg, cx, cy, cw, ch)

  // 标题
  ctx.font = 'bold 28px sans-serif'
  ctx.fillStyle = '#1a1a1a'
  const titleY = cy + ch + 24
  const titleLines = wrapText(ctx, data.title || '', cw, 32)
  titleLines.forEach((line, i) => {
    ctx.fillText(line, cx, titleY + i * 36)
  })

  // 地址
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#666666'
  const addrY = titleY + titleLines.length * 36 + 8
  const addrLines = wrapText(ctx, data.address || '', cw, 28)
  addrLines.forEach((line, i) => {
    ctx.fillText(line, cx, addrY + i * 30)
  })

  // 价格：与 ProductDetailModal 一致 — 紧跟地址块、上间距 48、左右各内缩 16、与底图底边留空（不贴底）
  ctx.textBaseline = 'top'
  ctx.font = 'bold 28px sans-serif'
  ctx.fillStyle = '#1a1a1a'
  const price = data.priceText || ''
  const pw = ctx.measureText(price).width
  const priceInsetX = 16
  const priceMarginTop = 48
  const priceMarginBottom = 20
  const priceLineH = 28
  const addrBlockEndY = addrY + addrLines.length * 30
  let priceY = addrBlockEndY + priceMarginTop
  const maxPriceTop = bgY + bgH - priceMarginBottom - priceLineH
  if (priceY > maxPriceTop) {
    priceY = maxPriceTop
  }
  ctx.fillText(price, cx + cw - priceInsetX - pw, priceY)

  // 底部条
  const bh = 140
  const by = h - bh
  ctx.fillStyle = '#ffd018'
  ctx.fillRect(0, by, w, bh)

  ctx.drawImage(t01Img, 20, by + 20, 320, 100)

  // 二维码占位 + 文案（与 ProductDetailModal .bottom{padding:20}、.code{margin-bottom:8} 一致）
  const bottomPad = 20
  const qrLabelGap = 8
  const qrSize = 70
  const qx = w - bottomPad - qrSize
  const qy = by + bottomPad
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(qx, qy, qrSize, qrSize)
  if (qrImg?.width && qrImg?.height) {
    drawImageContain(ctx, qrImg, qx, qy, qrSize, qrSize)
  }
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#1a1a1a'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('扫码查看', qx + qrSize / 2, qy + qrSize + qrLabelGap)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

/** 将图片以 aspectFit 方式绘制到矩形内（与 mode=aspectFit 一致） */
function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: any,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const iw = img.width
  const ih = img.height
  if (!iw || !ih) return
  const scale = Math.min(dw / iw, dh / ih)
  const sw = iw * scale
  const sh = ih * scale
  const ox = dx + (dw - sw) / 2
  const oy = dy + (dh - sh) / 2
  ctx.drawImage(img, ox, oy, sw, sh)
}

/** 将图片以 aspectFill 方式绘制到矩形内 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: any,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const iw = img.width
  const ih = img.height
  if (!iw || !ih) return
  const scale = Math.max(dw / iw, dh / ih)
  const sw = dw / scale
  const sh = dh / scale
  const sx = Math.max(0, (iw - sw) / 2)
  const sy = Math.max(0, (ih - sh) / 2)
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}
