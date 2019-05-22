<template>
  <div justify-space-between fluid grid-list-md  class="login-container">
    <el-row class="row">
      <el-col :span="8" :offset="8" class="sign-in">
        <h4>配 置</h4>
        <div v-loading="loading">
          <div class="input-box">
            <div class="input-title"> url: </div>
            <input type="text" v-model="config.url"/>
          </div>
          <div class="input-box">
            <div class="input-title"> token: </div>
            <input type="text" v-model="config.token"/>
          </div>
        </div>
        <button class="login-button" @click="commit">
          <i class="el-icon-loading" v-if="committing"></i>
          &nbsp;更 新 
        </button>
      </el-col>
    </el-row>
   
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      config: {
        url: 'admin',
        token: 'password'
      },
      loading: true,
      committing: false,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
        console.log(this.$route)
        console.log(this.$router)
      },
      immediate: true
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    async update() {
      this.loading = true
      await this.ajax.get('/eth').then(response => {
        this.config = response.info
        if (this.config.url === '' || this.config.url === null) {
          this.config.url = 'http://localhost:8545'
        }
      })
      this.loading = false
    },
    async commit() {
      this.commition = true
      await this.ajax.put('/eth', this.config).then(() => {
        this.$notify({
          type: 'success',
          message: '已提交',
          offset: 100
        })
      })
      this.commiting = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  position: absolute!important;
  padding-left: 10px;
  padding-right: 10px;
  background-color: white!important;
  // display: table!important;
  height: 100%;

  .row {
    top: 30%;
    -webkit-transform: translate(0, -30%);
    -moz-transform: translate(0, -30%);
    transform: translate(0, -30%);
  max-width: 1220px;
  margin-left: auto;
  margin-right: auto;
  }
  .sign-in {
    h4 {
      text-transform: capitalize;
      margin-bottom: 30px;
      margin-top: 0px;
      text-align: center;
      font-size:  18px;
    }
    .input-box {
      margin-top: 20px;
      .input-title {
        color: #666;
        margin: 0;
        padding: 0;
        font-size: 12px;
      }
      input {
        outline: 0;
        height: 36px;
        padding: 0 12px;
        border: 1px solid #ccc;
        width: 100%;
        font-size: 12px;
        &:hover {
          border-color: #999;
        }
        &:focus {
          border-color: #333;
        }
      }
    }
    .login-button {
      margin-top: 20px;
      width: 100%;
      padding: 0;
      font-size: 12px;
      display: block;
      height: 44px;
      line-height: 42px;
      background-color: #222;
      color: #fff;
      margin-bottom: 0;
      cursor: pointer;
      border: 1px solid transparent;
      outline: 0;
      font-weight: 400;
      border-radius: 0;
      transition: background .2s,border-color,.2s,color .2s;
      &:hover {
        background: rgba(34,34,34,.8);
        color: #fff;
        text-decoration: none;
      }
      &:focus {
        outline: #ccc auto 2px;
        text-decoration: none;
      }
      &:active {
        outline: #666 auto 2px;
      }
    }
  }

  .right-border {
    height: 250px;
    border-right: 1px solid #e5e5e5;
  }


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
