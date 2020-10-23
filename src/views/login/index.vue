<template>
  <div class='login-container'>
    <el-form
      class="login-form"
      :model="user"
      ref="login-form"
      :rules="formRules"
    >
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="onLogin" :loading="loginLoading">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data: () => ({
    user: {
      mobile: '13911111111',
      code: '246810',
      agree: false
    },
    loginLoading: false,
    formRules: {
      mobile: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
      ],
      agree: [
        // 自定义验证
        {
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(new Error('请同意协议'))
            }
          },
          trigger: 'change'
        }
      ]
    }
  }),
  created () {},
  methods: {
    onLogin () {
      // validate是异步的
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        this.login()
      })
    },
    login () {
      this.loginLoading = true

      login(this.user).then(res => {
        console.log(res)

        this.loginLoading = false

        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)

        this.loginLoading = false
        this.$message.error('登录失败，手机号或验证码错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login-bg.jpg") no-repeat;
  background-size: cover;
}
.login-form {
  background: #fff;
  padding: 50px;
  min-width: 300px;
  .login-btn {
    width: 100%;
  }
}
</style>
