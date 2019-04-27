const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

const app = express()

// 处理上传
// 存储设置
const storage = multer.diskStorage({
  destination: './public/upload/',
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

// 上传
const upload = multer({
  storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb)
  }
}).single('uploadFile')

// 校验文件类型
function checkFileType(file, cb) {
  // 匹配文件类型
  const fileTypes = /jpg|jpeg|png|gif/
  // 文件后缀名
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  // mimetype
  const mimetype = fileTypes.test(file.mimetype)
  // 返回结果
  return extName && mimetype ? cb(null, true) : cb('Error: 不支持上传此文件类型')
}

// 模版引擎
app.set('view engine', 'ejs')

// 静态资源目录
app.use(express.static('./public'))

// 路由
app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.render('index', {
        msg: err
      })
    } else {
      if(req.file === undefined) {
        res.render('index', {
          msg: '请选择文件'
        })
      } else {
        res.render('index', {
          msg: '上传成功',
          path: `upload/${req.file.filename}`
        })
      }
    }
  })
})

const port = 3004

app.listen(port, () => console.log(`server listen at port: ${port}!`))