<template>
  <div class="min-h-screen bg-white">
    <div class="flex items-center justify-center">
      <!-- 个人信息卡片 -->
      <div class="bg-white rounded-lg p-6">
        <!-- 基本信息 -->
        <div class="flex items-start">
          <div class="avatar-wrapper">
            <!-- 头像 -->
            <img :src="userStore.profile.avatar" class="user-image" />
          </div>


          <!-- 用户信息 -->
          <div class="info">
            <div>
              <div>
                <div class="flex">
                  <h1 class="user-nickname">{{ userStore.profile.nickname }}</h1>
                  <!-- 右侧按钮组 -->
                  <div class="flex items-center gap-3">
                    <button class="bg-[#ff2e4d] text-white rounded-full font-bold w-[96px] h-[40px] cursor-pointer">
                      关注
                    </button>
                    <!-- 编辑按钮和下拉菜单 -->
                    <div class="relative">
                      <button 
                        class="w-9 h-9 cursor-pointer border border-gray-200 hover:bg-gray-50 rounded-full flex items-center justify-center"
                        @click="toggleDropdown"
                        ref="dropdownTrigger"
                      >
                        <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        
                      </button>

                      <!-- 下拉菜单 -->
                      <Transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                      >
                        <div 
                          v-if="showDropdown"
                          class="absolute right-0 mt-2 w-[140px] bg-white rounded-lg shadow-lg p-1 z-50 border border-gray-100"
                        >
                          <button 
                            class="w-full px-4 py-2 text-left text-gray-600 hover:text-gray-800 
                            hover:bg-gray-50 flex items-center rounded-lg cursor-pointer"
                            @click="editProfile"
                          >
                            <svg t="1740136979710" class="icon w-5 h-5 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12707" width="200" height="200"><path d="M510.528 337.792c-98.048 0-177.792 78.848-177.792 175.744 0 96.96 79.744 175.808 177.792 175.808 9.536 0 19.584-1.024 31.744-3.136a33.152 33.152 0 0 0 27.008-38.4 33.28 33.28 0 0 0-38.912-26.624 114.048 114.048 0 0 1-19.84 2.048 110.4 110.4 0 0 1-110.848-109.696c0-60.416 49.664-109.632 110.72-109.632 61.12 0 110.848 49.216 110.848 109.632 0 5.952-0.64 12.16-2.112 19.584a33.152 33.152 0 0 0 33.024 39.04c16.256 0 30.08-11.52 32.832-27.2 2.176-11.392 3.2-21.376 3.2-31.36 0-46.912-18.496-91.008-52.096-124.224a177.536 177.536 0 0 0-125.568-51.584z" p-id="12708" fill="#515151"></path><path d="M938.56 432.768a29.504 29.504 0 0 0-22.528-23.04 151.104 151.104 0 0 1-98.24-71.616 148.352 148.352 0 0 1-13.632-119.68 28.928 28.928 0 0 0-8.96-30.848 435.84 435.84 0 0 0-141.696-80.896 29.888 29.888 0 0 0-31.552 7.744 151.68 151.68 0 0 1-111.488 48.128 151.872 151.872 0 0 1-111.616-48.192 30.464 30.464 0 0 0-31.552-7.744c-52.48 18.176-100.16 45.44-141.632 80.96a29.184 29.184 0 0 0-8.96 30.72c12.608 40.64 7.744 83.2-13.568 119.744A150.848 150.848 0 0 1 104.96 409.6a29.696 29.696 0 0 0-22.592 23.168 428.8 428.8 0 0 0-7.872 80.768c0 26.432 2.624 53.632 7.872 80.768 2.176 11.456 11.008 20.48 22.528 23.104 41.92 9.6 76.8 34.944 98.24 71.552 21.312 36.608 26.176 79.168 13.568 119.808a29.44 29.44 0 0 0 8.96 30.72 436.48 436.48 0 0 0 141.696 80.96c11.456 3.84 23.68 0.512 31.424-7.68a151.872 151.872 0 0 1 111.616-48.256c42.624 0 82.304 17.152 111.552 48.192a29.888 29.888 0 0 0 31.616 7.808 436.48 436.48 0 0 0 141.632-80.896 29.44 29.44 0 0 0 8.96-30.72 147.84 147.84 0 0 1 13.632-119.808c21.376-36.672 56.192-62.08 98.24-71.552a29.76 29.76 0 0 0 22.528-23.104 429.44 429.44 0 0 0 7.872-80.768 430.08 430.08 0 0 0-7.872-80.896z m-209.92 357.12a352.896 352.896 0 0 1-85.44 48.832 201.728 201.728 0 0 0-265.6 0 353.28 353.28 0 0 1-85.44-48.832 194.816 194.816 0 0 0-22.784-138.624 199.424 199.424 0 0 0-110.208-88.832 339.84 339.84 0 0 1 0-97.728A199.488 199.488 0 0 0 269.44 375.872a195.84 195.84 0 0 0 22.72-138.624A353.28 353.28 0 0 1 377.6 188.416c36.8 32.192 83.776 49.92 132.8 49.92 49.152 0 96.128-17.664 132.8-49.856 30.72 12.288 59.456 28.672 85.44 48.832a195.648 195.648 0 0 0 22.656 138.624c24.448 41.984 63.424 73.344 110.208 88.832a341.12 341.12 0 0 1 0.064 97.664c-46.72 15.488-85.76 46.848-110.144 88.832a196.224 196.224 0 0 0-22.784 138.624z" p-id="12709" fill="#515151"></path></svg>
                            编辑资料
                          </button>
                        </div>
                      </Transition>
                    </div>
                  </div>
                  
                </div>


              </div>

              <div class="user-content">
                    <span>小哈书号：{{ userStore.profile.xiaohashuId }}</span>
                    <span class="mx-2">|</span>
                    <span>IP属地：中国</span>
                  </div>

              <!-- 个人简介 -->
              <div class="user-desc">
                {{ userStore.profile.introduction || '此用户还未填写简介'}}
              </div>

              <!-- 性别年龄地区 -->
              <div class="flex items-center mt-[16px] text-[12px]">
                <span class="user-tag">
                  <svg v-if="userStore.profile.sex === 0" t="1740127656798" class="icon w-3 h-2.5 text-[#ff2442]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9302" width="200" height="200"><path d="M512 93.090909c130.327273 0 232.727273 102.4 232.727273 232.727273s-102.4 232.727273-232.727273 232.727273-232.727273-102.4-232.727273-232.727273 102.4-232.727273 232.727273-232.727273m-46.545455 553.890909v97.745455h-186.181818c-27.927273 0-46.545455 18.618182-46.545454 46.545454s18.618182 46.545455 46.545454 46.545455h186.181818v139.636363c0 23.272727 23.272727 46.545455 46.545455 46.545455 27.927273 0 46.545455-23.272727 46.545455-46.545455v-139.636363h186.181818c27.927273 0 46.545455-18.618182 46.545454-46.545455s-18.618182-46.545455-46.545454-46.545454h-186.181818v-97.745455c176.872727-27.927273 302.545455-190.836364 274.618181-367.709091-27.927273-176.872727-190.836364-302.545455-367.709091-274.618182-176.872727 27.927273-302.545455 190.836364-274.618181 367.709091 18.618182 144.290909 130.327273 256 274.618181 274.618182" fill="#F8355C" p-id="9303"></path></svg>
                  <svg v-else t="1740547397483" class="icon w-3 h-2.5 text-[#ff2442]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13790" width="200" height="200"><path d="M914.285714 0 658.285714 0l0 109.714286 178.428343 0-160.393143 160.393143C605.429029 215.606857 516.928 182.857143 420.571429 182.857143 188.286171 182.857143 0 371.143314 0 603.428571s188.286171 420.571429 420.571429 420.571429 420.571429-188.286171 420.571429-420.571429c0-96.356571-32.749714-184.8576-87.250286-255.749486L914.285714 187.285943 914.285714 365.714286l109.714286 0L1024 109.714286 1024 0 914.285714 0zM420.571429 914.285714c-171.392 0-310.857143-139.465143-310.857143-310.857143s139.465143-310.857143 310.857143-310.857143 310.857143 139.465143 310.857143 310.857143S591.963429 914.285714 420.571429 914.285714z" fill="#F69661" p-id="13791"></path></svg>
                  {{ userStore.profile.age || 0 }}岁
                </span>
                <span class="user-tag">中国</span>
              </div>

              <!-- 数据统计 -->
              <div class="flex items-center gap-8 mt-[20px]">
                <div class="flex items-center">
                  <div class="text-[14px] font-medium text-[#333] mr-[4px]">65</div>
                  <div class="text-sm text-[#999]">关注</div>
                </div>
                <div class="flex items-center">
                  <div class="text-[14px] font-medium text-[#333] mr-[4px]">42.9万</div>
                  <div class="text-sm text-[#999]">粉丝</div>
                </div>
                <div class="flex items-center">
                  <div class="text-[14px] font-medium text-[#333] mr-[4px]">144.9万</div>
                  <div class="text-sm text-[#999]">获赞与收藏</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

          <!-- Tab 导航 -->
          <div class="mt-[48px]">
        <TabNav
          v-model="activeTab"
          :tabs="[
            { key: 'notes', label: '笔记', count: '208' },
            { key: 'collect', label: '收藏', count: '317' },
            { key: 'like', label: '赞过' }
          ]"
        />
        
        <!-- 笔记列表容器 -->
        <div class="masonry-container" v-if="activeTab === 'notes'">
          <div v-for="note in notes" :key="note.id" class="masonry-item">
            <NoteCard :note="note" @click="onNoteClick" />
          </div>
        </div>

        <div v-else-if="activeTab === 'collect'" class="masonry-container">
          <!-- 收藏的笔记列表 -->
          收藏的笔记列表
        </div>

        <div v-else class="masonry-container">
          <!-- 赞过的笔记列表 -->
          赞过的笔记列表
        </div>
      </div>

          <!-- 笔记详情模态框 -->
          <NoteDetailModal 
            v-model:visible="showModal"
            :note="selectedNote"
          />

          <!-- 编辑资料模态框 -->
          <EditProfileModal 
            v-if="userStore.profile.avatar" 
            v-model:visible="showEditModal" 
            :avatar="userStore.profile.avatar"
          />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import TabNav from '@/components/common/TabNav.vue'
import NoteCard from '@/components/note/NoteCard.vue'
import NoteDetailModal from '@/components/note/NoteDetailModal.vue'
import EditProfileModal from '@/components/profile/EditProfileModal.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 当前激活的 tab
const activeTab = ref('notes')

// 模拟笔记数据
const notes = [
  {
    id: 1,
    title: '瓜子竟然还能这么吃',
    cover: 'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
    images: [
      'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241258/ce7ef50b42dcdeec9c4af443b877ed34/1040g00831e7se6gsgu6g4acqqd59ban5s3d3dog!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241301/3ec1b491d2c096fc2ed1b3a5c3eea15a/1040g00831d5enigpgs0040nsgprv0dv8r8ju3ro!nc_n_webp_mw_1',
    ],
    isVideo: false,
    author: {
      name: '姜小丹',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip'
    },
    likes: '1千'
  },
  {
    id: 1,
    title: '瓜子竟然还能这么吃',
    cover: 'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
    images: [
      'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241258/ce7ef50b42dcdeec9c4af443b877ed34/1040g00831e7se6gsgu6g4acqqd59ban5s3d3dog!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241301/3ec1b491d2c096fc2ed1b3a5c3eea15a/1040g00831d5enigpgs0040nsgprv0dv8r8ju3ro!nc_n_webp_mw_1',
    ],
    isVideo: false,
    author: {
      name: '姜小丹',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip'
    },
    likes: '1千'
  },
  {
    id: 1,
    title: '瓜子竟然还能这么吃',
    cover: 'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
    images: [
      'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241258/ce7ef50b42dcdeec9c4af443b877ed34/1040g00831e7se6gsgu6g4acqqd59ban5s3d3dog!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241301/3ec1b491d2c096fc2ed1b3a5c3eea15a/1040g00831d5enigpgs0040nsgprv0dv8r8ju3ro!nc_n_webp_mw_1',
    ],
    isVideo: false,
    author: {
      name: '姜小丹',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip'
    },
    likes: '1千'
  },
  {
    id: 1,
    title: '瓜子竟然还能这么吃',
    cover: 'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
    images: [
      'https://sns-webpic-qc.xhscdn.com/202502241258/455f2f8f78cc9de6f52ad82ae18a74c3/1040g00831duvm17ngu005ov5v2lpguup8k20mr0!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241258/ce7ef50b42dcdeec9c4af443b877ed34/1040g00831e7se6gsgu6g4acqqd59ban5s3d3dog!nc_n_webp_mw_1',
      'https://sns-webpic-qc.xhscdn.com/202502241301/3ec1b491d2c096fc2ed1b3a5c3eea15a/1040g00831d5enigpgs0040nsgprv0dv8r8ju3ro!nc_n_webp_mw_1',
    ],
    isVideo: false,
    author: {
      name: '姜小丹',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip'
    },
    likes: '1千'
  },
]

const showModal = ref(false)
const selectedNote = ref(null)

// 点击笔记卡片时的处理函数
const onNoteClick = (note) => {
  selectedNote.value = note
  showModal.value = true
}

// 下拉菜单状态
const showDropdown = ref(false)
const dropdownTrigger = ref(null)

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 编辑资料模态框状态
const showEditModal = ref(false)

// 使用计算属性获取头像
const userAvatar = computed(() => userStore.profile.avatar || '')

// 更新整个 profile 的方法
const updateProfile = (newProfile) => {
  userStore.setProfile(newProfile)
}

// 编辑资料
const editProfile = () => {
  showDropdown.value = false
  showEditModal.value = true
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (dropdownTrigger.value && !dropdownTrigger.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// 添加和移除点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-image {
  border-radius: 50%;
  margin: 0 auto;
  width: 70%;
  height: 100%;
  object-fit: cover;
}

.avatar-wrapper {
    text-align: center;
    width: calc((1728px - 7* 32px) / 6* 1);
    height: calc(0.7* calc((1728px - 7* 32px) / 6* 1));
}

@media screen and (min-width: 1424px) and (max-width: 1727px) {
    .avatar-wrapper {
        width: calc((100vw - 7* 32px) / 6* 1);
        height: calc(0.7* calc((100vw - 7* 32px) / 6* 1));
    }
}

.user-nickname {
    font-weight: 600;
    font-size: 24px;
    line-height: 120%;
    color: var(--color-primary-label);
    word-wrap: break-word;
    width: 100%;
}

.user-content {
    width: 100%;
    font-size: 12px;
    line-height: 120%;
    color: var(--color-tertiary-label);
    display: flex
;
}

.info {
    margin-left: 32px;
    width: calc(32px + calc((100vw - 7* 32px) / 6* 2));
}

.user-desc {
    width: 100%;
    font-size: 14px;
    line-height: 140%;
    color: var(--color-primary-label);
    margin-top: 16px;
    white-space: pre-line;
}

.user-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    gap: 4px;
    height: 18px;
    border-radius: 41px;
    background: var(--color-active-background);
    height: 24px;
    line-height: 24px;
    margin-right: 6px;
    color: var(--color-tertiary-label);
}

.masonry-container {
  columns: 5;
  column-gap: 16px;
  padding: 16px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

@media (max-width: 1800px) {
  .masonry-container {
    columns: 5;
  }
}

@media (max-width: 1400px) {
  .masonry-container {
    columns: 4;
  }
}

@media (max-width: 1100px) {
  .masonry-container {
    columns: 3;
  }
}
</style>