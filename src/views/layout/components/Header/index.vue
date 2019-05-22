<template>
  <div class="header">
    <div class="navbar">
      <el-row>
        <el-col :span="9" class="left-part">
          <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened"/>
          <transition name="fade" v-for="(item, index) in categories" :key="index">
            <a :class="{'cate': true, 'selected': item.selected}" 
              v-show="!item.hidden"
              @click="jumpToCategory(item)">
              {{item.name}}
            </a>
          </transition>
        </el-col>
        <el-col :span="6" class="center-part">
          Smart Home
        </el-col>
        <el-col :span="9">
          <div class="right-part" v-if="$route.path !== '/login'">
            <div class="dropdown">
              <a href="javascript:void(0);">
                <svg-icon icon-class="user"/>
                <span>{{user.username}}</span>
              </a>
              <div class="dropdown-content right-align">
                <div class="user-container">
                  <img :src="user !== null ? user.avatar_url : '/static/logo.png'"> 
                  <router-link tag="span" to="/smart_home">您好，{{user.username}}</router-link>
                </div>
                <router-link to="/smart_home" tag="a" class="emphasis">
                  主页 
                </router-link>
                <a href="javascript:void(0);" @click="logout"> 注销 </a>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from './Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user'
    ])
  },
  data() {
    return {
      categories: [
        {
          name: 'Home',
          selected: false,
          hidden: false
        },
        {
          name: 'Eat',
          selected: false,
          hidden: true
        },
        {
          name: '配置',
          selected: false,
          hidden: false
        }
      ]
    }
  },
  watch: {
    $route (from, to) {
      this.updateCategories()
    }
  },
  mounted() {
    this.updateCategories()
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    updateCategories() {
      if (this.$route.path === '/smart_home') {
        this.categories[0].selected = true
        this.categories[1].hidden = true
        this.categories[2].selected = false
      } else if (this.$route.path === '/settings') {
        this.categories[0].selected = false
        this.categories[1].hidden = true
        this.categories[2].selected = true
      } else {
        this.categories[0].selected = false
        this.categories[1].hidden = false
        this.categories[1].selected = true
        this.categories[1].name = this.$route.name
        this.categories[2].selected = false
      } 
    },
    jumpToCategory(category) {
      if (category.name === 'Home') {
        this.$router.push('/smart_home')
      } else if (category.name === '配置') {
        this.$router.push('/settings')
      }
    },
    logout () {
      this.$router.push('/login')
      return
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login')
        // location.reload() 
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  .navbar {
    z-index: 1;
    height: 70px;
    line-height: 70px;
    border-radius: 0px !important;
    background-color: #F7F8FA;
    box-shadow: 0 6px 12px 0 rgba(0,0,0,.04);
    width: 100%;
    white-space : nowrap;

    .left-part {
      height: 70px;
      white-space: nowrap;
      overflow-x: hidden;
      overflow-y: hidden;
    }

    .breadcrumb-container {
      float: left;
    }

    .center-part {
      text-align: center;
      font-size: 25px;
      font-weight:900;
      overflow-x: visible;
      white-space : nowrap;
    }

    .right-part {
      display: block;
      text-align: right;
      float: right;
      padding-right: 30px;
    }

    .cate {
      float: left; 
      white-space : nowrap;
      cursor: hand;
      height: 70px;
      line-height: 70px;
      color: rgba(0, 0, 0, 0.6);
      padding: 0 20px 0 20px;
      min-width: 20%;
      text-align: center; 
      font-size: 16px;
      &.selected {
        background-color: white;
        font-weight: 400;
        color:black;
      }
      &:hover {
        color:black;
      }
    }

    .dropdown {
      position: relative;
      height: 70px;
      line-height: 70px;
      display:inline-block;
      padding: 0;
      cursor: pointer;
      vertical-align: top;
      &:hover {
        background-color: white;
        .dropdown-content {
          display: block;
        }
      }

      a, .dropdown-title {
        vertical-align: middle;
        height: 70px;
        line-height: 70px;  
        display: inline-block;
        padding: 0 10px;
        img {
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
        span {
          padding-left: 3px;
          color: #666;
          font-size: 12px;
          font-weight: 700;
        }
      }

      .dropdown-content {
        position: absolute;
        display: none;
        padding: 0 20px 10px 20px;
        text-align: left;
        background-color: white;
        box-shadow: 0 6px 6px 0 rgba(0,0,0,.08);

        &.left-align {
          left: 0px;
        }
        &.right-align {
          right: 0px;
        }

        a {
          display: block;
          font-size: 12px;
          line-height: 30px;
          height: 30px;
          width: 100%;
          color: rgba(0,0,0,.6);
          padding: 0;
          margin: 0;
          &:hover {
            color: #000;
          }

          &.emphasis {
            line-height: 45px;
            height: 45px;
            font-weight: 700;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.6);
            width: 100%;
            &:hover {
              color: black;
            }
          }
        }
      }

      .user-container {
        height: 70px;
        line-height: 70px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        white-space : nowrap;
        img {
          width: 40px;
          height: 40px;
          vertical-align: middle;
          display: inline-block;
        }
        span {
          padding-left: 10px;
          padding-bottom: 16px;
          display: inline-block;
          line-height: 12px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(15, 13, 13, 0.6);
          vertical-align: bottom;
          &:hover {
            color: black;
          }
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
