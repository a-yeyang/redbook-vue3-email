<template>
  <div class="min-h-screen bg-white">
    <!-- 搜索结果分类导航 -->
    <div class="border-b border-gray-100">
      <div class="flex items-center mb-2">
        <nav class="grow">
          <ul class="flex items-center">
            <li v-for="category in categories" :key="category.name">
              <a 
                href="#" 
                class="px-4 py-2 rounded-full transition-colors h-[40px] hover:bg-[#f4f4f4]"
                :class="category.name === '全部' ? 'bg-[#f4f4f4] text-[#333] font-bold' : 'text-[#666] hover:text-[#333]'"
              >
                {{ category.name }}
              </a>
            </li>
          </ul>
        </nav>
        <div class="cursor-pointer flex items-center px-4 py-2 hover:bg-[#f4f4f4] rounded-full text-[#666] hover:text-[#333] relative">
          <div class="flex items-center" @click="showFilter = !showFilter">
            <svg t="1740221132886" class="icon w-5 h-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16352" width="200" height="200"><path d="M387.1 864.3c-9.9 0-19.7-2.5-28.6-7.6-18-10.3-29.1-29.6-29-50.4l1.7-228.9c0-3.5-1-6.9-2.9-9.9L133.5 268.2c-16.6-25.6-17.9-58.1-3.2-84.8 14.5-26.6 42.3-43 72.6-43h0.6l491.8 3.6c30.5 0.2 58.3 17.1 72.5 44.1 14.3 27 12.5 59.4-4.5 84.8L564.1 569.2c-2 2.9-3 6.3-3 9.8l-1.2 159c-0.1 20-10.9 38.7-28 49l-115.3 69.1c-9 5.4-19.3 8.2-29.5 8.2zM202.8 205.2c-9.5 0-14.1 6.5-15.7 9.3-1.6 2.8-4.6 10.3 0.7 18.3l194.8 299.3c8.9 13.6 13.5 29.4 13.4 45.7l-1.6 216 100.7-60.4 1.1-154.9c0.1-16.3 5-32 14.1-45.5l199.1-296.4c5.4-8 2.5-15.5 1-18.3-1.5-2.8-6-9.5-15.7-9.5l-491.8-3.6h-0.1z" fill="#707070" p-id="16353"></path><path d="M825.2 599.6h-169c-17.9 0-32.4-14.5-32.4-32.4s14.5-32.4 32.4-32.4h169c17.9 0 32.4 14.5 32.4 32.4s-14.5 32.4-32.4 32.4zM825.2 717.5h-169c-17.9 0-32.4-14.5-32.4-32.4s14.5-32.4 32.4-32.4h169c17.9 0 32.4 14.5 32.4 32.4s-14.5 32.4-32.4 32.4zM825.2 835.5h-169c-17.9 0-32.4-14.5-32.4-32.4s14.5-32.4 32.4-32.4h169c17.9 0 32.4 14.5 32.4 32.4s-14.5 32.4-32.4 32.4z" fill="#707070" p-id="16354"></path></svg>
            <div>筛选</div>
          </div>

          <!-- 筛选弹出框 -->
          <div 
            v-if="showFilter" 
            ref="filterRef"
            class="absolute right-0 top-12 w-[460px] bg-white rounded-lg shadow-lg p-5 z-50 border border-gray-100"
          >
            <div class="space-y-5">
              <!-- 排序依据 -->
              <div>
                <div class="text-gray-600 font-medium mb-3 text-xs">排序依据</div>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="sort in sortOptions" 
                    :key="sort.value"
                    class="px-3 py-2 rounded-full text-sm inline-flex items-center justify-center"
                    :class="selectedSort === sort.value ? 'border border-[#ff2442] text-[#ff2442] bg-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    @click="selectedSort = sort.value"
                  >
                    <div class="flex items-center justify-center">
                      <span>{{ sort.label }}</span>
                      <svg 
                        v-if="selectedSort === sort.value"
                        class="w-3 h-3 ml-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 笔记类型 -->
              <div>
                <div class="text-gray-600 font-medium mb-3 text-xs">笔记类型</div>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="type in noteTypes" 
                    :key="type.value"
                    class="px-3 py-2 rounded-full text-sm inline-flex items-center justify-center"
                    :class="selectedType === type.value ? 'border border-[#ff2442] text-[#ff2442] bg-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    @click="selectedType = type.value"
                  >
                    <div class="flex items-center justify-center">
                      <span>{{ type.label }}</span>
                      <svg 
                        v-if="selectedType === type.value"
                        class="w-3 h-3 ml-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 发布时间 -->
              <div>
                <div class="text-gray-600 font-medium mb-3 text-xs">发布时间</div>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="time in timeFilters" 
                    :key="time.value"
                    class="px-3 py-2 rounded-full text-sm inline-flex items-center justify-center"
                    :class="selectedTime === time.value ? 'border border-[#ff2442] text-[#ff2442] bg-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    @click="selectedTime = time.value"
                  >
                    <div class="flex items-center justify-center">
                      <span>{{ time.label }}</span>
                      <svg 
                        v-if="selectedTime === time.value"
                        class="w-3 h-3 ml-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 底部按钮 -->
              <div class="flex gap-2 pt-2">
                <button 
                  class="cursor-pointer flex-1 h-10 font-bold rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                  @click="resetFilters"
                >
                  重置
                </button>
                <button 
                  class="cursor-pointer flex-1 h-10 font-bold rounded-full bg-[#ff2442] text-white hover:opacity-90"
                  @click="applyFilters"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 搜索结果内容 -->
    <div class="container mx-auto mt-6">
      <!-- 瀑布流布局 -->
      <div v-if="activeTab !== 'user'" class="masonry-container">
        <div v-for="note in notes" :key="note.id" class="masonry-item">
          <NoteCard :note="note" @click="onNoteClick" />
        </div>
      </div>

      <!-- 用户列表 -->
      <div v-else class="grid grid-cols-4 gap-4">
        <div v-for="user in users" :key="user.id" class="bg-white rounded-lg p-4">
          <div class="flex items-center gap-4">
            <img :src="user.avatar" class="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 class="font-medium">{{ user.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ user.bio }}</p>
            </div>
          </div>
          <button class="mt-4 w-full h-9 rounded-full bg-[#ff2442] text-white text-sm hover:opacity-90">
            关注
          </button>
        </div>
      </div>
    </div>

    <!-- 笔记详情模态框 -->
    <NoteDetailModal 
      v-model:visible="showModal"
      :note="selectedNote"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TabNav from '@/components/common/TabNav.vue'
import NoteCard from '@/components/note/NoteCard.vue'
import NoteDetailModal from '@/components/note/NoteDetailModal.vue'
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const activeTab = ref('all')
const showModal = ref(false)
const selectedNote = ref(null)

// 筛选相关状态
const showFilter = ref(false)
const filterRef = ref(null)
const selectedTime = ref('')
const selectedSort = ref('comprehensive')
const selectedType = ref('')

const categories = [
  { name: '全部' },
  { name: '图文' },
  { name: '视频' },
  { name: '用户' },
]

// 排序方式选项
const sortOptions = [
  { label: '综合', value: 'comprehensive' },
  { label: '最新', value: 'newest' },
  { label: '最多点赞', value: 'most_liked' },
  { label: '最多收藏', value: 'most_collected' },
  { label: '最多评论', value: 'most_commented' }
]

// 笔记类型选项
const noteTypes = [
  { label: '不限', value: '' },
  { label: '视频', value: 'video' },
  { label: '图文', value: 'image' }
]

// 时间筛选选项
const timeFilters = [
  { label: '不限', value: '' },
  { label: '一天内', value: '1d' },
  { label: '一周内', value: '1w' },
  { label: '一月内', value: '1m' },
  { label: '半年内', value: '6m' }
]

// 使用 vueuse 的 onClickOutside
onClickOutside(filterRef, () => {
  showFilter.value = false
})

// 重置筛选
const resetFilters = () => {
  selectedTime.value = ''
  selectedSort.value = 'comprehensive'
  selectedType.value = ''
}

// 应用筛选
const applyFilters = () => {
  // TODO: 应用筛选条件
  console.log('应用筛选:', {
    time: selectedTime.value,
    sort: selectedSort.value,
    type: selectedType.value
  })
  showFilter.value = false
}

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

// 模拟用户数据
const users = [
  {
    id: 1,
    name: '清妍',
    avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg',
    bio: '分享美好生活'
  },
  // ... 更多用户数据
]

// 点击笔记卡片
const onNoteClick = (note) => {
  selectedNote.value = note
  showModal.value = true
}

onMounted(() => {
  // 获取搜索关键词
  const keyword = route.query.keyword
  // TODO: 根据关键词获取搜索结果
  console.log('搜索关键词:', keyword)
})
</script>

<style scoped>
.masonry-container {
  columns: 5;
  column-gap: 16px;
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