<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="registerForm" :rules="rules"  class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">Register</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="registerForm.password"
          name="password"
          placeholder="password"
          @keyup.enter.native="register" />
      </el-form-item>
      <el-form-item prop="password_confirm">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="registerForm.password_confirm"
          name="password_confirm"
          placeholder="password confirm"
          @keyup.enter.native="register" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="register">
          Register
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次密码不一样'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        password_confirm: [{ required: true, trigger: 'blur', validator: validatePasswordConfirm }]
      },
      registerForm: {
        username: '',
        password: '',
        password_confirm: ''
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
  },
  methods: {
    async register () {
      let valid = true
      await this.$refs.loginForm.validate(value => {
        valid = value
      })
      if (!valid) {
        return
      }
      this.loading = true
      if (this.registerForm.username === '' || this.registerForm.password === '') {
        this.$notify({
          message: 'username or password must not be empty',
          type: 'error'
        })
        return
      }
      if (this.registerForm.password !== this.registerForm.password_confirm) {
        this.$notify({
          message: 'password confirm is incorrect',
          type: 'error'
        })
        return
      }

      await this.ajax.post('/register', this.registerForm).then(response => {
        this.$notify({
          message: 'registered',
          type: 'success'
        })
        this.$router.push('/login')
      })

      this.loading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
