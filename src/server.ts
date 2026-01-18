import express from 'express'
import cors from 'cors'
import { SSOService } from '@/core/sso.service'
import { ticket } from '@/core/ticket'

const app = express()
app.use(cors({ origin: 'http://localhost:6657' }))
app.use(express.json())


let loggedInUser = { username: '', password: '' }
// 登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const sso = new SSOService()
    // 这里需要改造 SSOService，让它接收 username/password 参数
    const success = await sso.login(username, password)
    loggedInUser = { username, password }  // 保存到内存

    if (success) {
      res.json({ success: true, message: '登录成功' })
    } else {
      res.status(401).json({ success: false, message: '登录失败' })
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 购票接口
app.post('/api/buy', async (req, res) => {
  const { date, number } = req.body

  try {
    const { username, password } = loggedInUser
    await ticket.buy(username, password, date, number)  // 传过去
    res.json({ success: true, message: '购票成功' })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})