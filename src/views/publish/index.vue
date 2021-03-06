<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
       :model="article"
       label-width="60px"
       :rules="formRules"
       ref="publish-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
           v-model="article.content"
           :extensions="extensions"
           lang="zh"
           height="230"
           placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <!-- 如果在子组件传值传参以后，还需要获得index等参数，则需手动指定$event -->
            <!--
              如果父组件传值给子组件的数据，还需要修改
              则可以使用 v-model 简化

              <upload-cover
                v-for="(cover, index) in article.cover.type"
                :key="cover"
                @update-cover="onUpdateCover(index, $event)"
                :cover-image="article.cover.images[index]"
              ></upload-cover>

              v-model="article.cover.images[index]"
              相当于
                给子组件传递了名字叫value的数据
                :value="article.cover.images[index]"
                和
                默认监听input事件
                @input="article.cover.images[index]=事件参数"
            -->
            <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"
            ></upload-cover>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select placeholder="请选择频道" v-model="article.channel_id">
            <el-option
             :label="channel.name"
             :value="channel.id"
             v-for="(channel, index) in channels"
             :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Fullscreen,
  Image,
  CodeBlock,
  HorizontalRule,
  TextColor,
  Preview
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'

export default {
  name: 'PublishIndex',
  data: () => ({
    article: {
      title: '',
      content: '',
      cover: {
        type: 1,
        images: []
      },
      channel_id: null
    },
    channels: [],
    // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
    extensions: [
      new Doc(),
      new Text(),
      new Paragraph(),
      new Heading({ level: 5 }),
      new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
      new Image({
        // 默认把图片生成base64格式和内容存储在一起
        uploadRequest (file) {
          // 图片上传方法，返回一个Promise<url>
          const formdata = new FormData()
          formdata.append('image', file)
          return uploadImage(formdata).then(res => {
            console.log(res)
            return res.data.data.url
          })
        }
      }),
      new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
      new Italic(),
      new Strike(),
      new HorizontalRule(),
      new TextColor({ bubble: true }),
      new ListItem(),
      new BulletList(),
      new OrderedList(),
      new Fullscreen(),
      new CodeBlock(),
      new Preview()
    ],
    formRules: {
      title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 5, max: 30, message: '长度为5到30个字符', trigger: 'blur' }
      ],
      content: [
        {
          validator (rule, value, callback) {
            if (value === '<p></p>') {
              callback(new Error('请输入文章内容'))
            } else {
              callback()
            }
          }
        },
        { required: true, message: '请输入文章内容', trigger: 'blur' }
      ],
      channel_id: [
        { required: true, message: '请选择文章频道' }
      ]
    }
  }),
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  created () {
    this.loadChannels()

    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          // 异步操作
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '修改草稿' : '修改'}成功`,
              type: 'success'
            })
          })
          this.$router.push('/article')
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
          })
          this.$router.push('/article')
        }
      })
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped>

</style>
