<template>
  <Teleport to="body">
    <!-- 遮罩层 -->
    <div v-if="visible" class="fixed inset-0 bg-gray-800/25 z-[100]" @click="onClose"></div>
    
    <!-- 笔记详情 -->
    <Transition 
      name="zoom"
      appear
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="visible" class="fixed inset-0 z-[101] pointer-events-none">
        <div 
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white h-[90vh] 
          max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] w-auto rounded-lg flex overflow-hidden pointer-events-auto"
          ref="modalRef"
        >
          <!-- 左侧图片区域 -->
          <div class="h-full flex-1 flex items-center justify-center overflow-hidden">
            <div class="h-full w-full flex items-center justify-center">
              <ImageCarousel v-if="currNote.type === 0" :images="currNote.imgUris || []" class="h-full w-full" />
              <VideoPlayer v-else
                      :video-url="currNote.videoUri" 
                      :autoplay="true"
                    ></VideoPlayer>
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="w-[480px] min-w-[480px] flex flex-col bg-white">

            <!-- 作者信息 -->
            <div 
              class="p-[24px] flex items-center sticky top-0 bg-white"
              :class="{'border-b border-gray-100': isScrolled}"
              ref="authorInfoRef"
            >
              <img 
                :src="currNote.avatar" 
                class="w-[40px] h-[40px] rounded-full"
              />
              <div class="ml-[12px] flex-1">
                <div class="font-medium text-[16px] text-gray-600 hover:text-gray-800">{{ currNote.creatorName }}</div>
              </div>
              <button class="bg-[#ff2442] text-white px-6 py-2 rounded-full font-bold hover:opacity-90 w-[96px] h-[40px] cursor-pointer">
                关注
              </button>
            </div>

            <!-- 评论区域容器 -->
            <div 
              class="overflow-y-auto flex-1" 
              @scroll="handleScroll"
              ref="scrollContainerRef"
            >
              <!-- 笔记正文 -->
              <div 
                class="text-[#333] px-[24px] pb-[24px] flex-1"
                ref="contentRef"
              >
                <h1 class="title">{{ currNote.title }}</h1>
                <div class="leading-relaxed">
                    {{ currNote.content }}
                </div>
                <ul v-if="currNote.topics && currNote.topics.length > 0" class="text-[#13386c] flex flex-wrap gap-2">
                  <li v-for="(topic, index) in currNote.topics" :key="index" class="cursor-pointer">#{{topic.name}}</li>
                </ul>
                <div class="text-gray-500 text-[14px] mt-[12px]">
                  编辑于 {{ currNote.updateTime }}
                </div>
              </div>

              <!-- 分割线 -->
              <div class="h-[1px] border-b border-gray-100 mx-[24px]"></div>

              <!-- 评论区 -->
              <CommentList
                :comments="comments"
                :total="commentTotal"
                :has-more="hasMoreComments"
                :more-count="moreCommentsCount"
                @load-more="loadMoreComments"
                @reply="onReplyClick"
              />
            </div>
            

            <!-- 底部互动区 -->
            <div class="border-t border-gray-100 p-[16px]">
              <div class="flex flex-col text-gray-500 text-[15px]">
                <!-- 评论输入区域 -->
                <div class="flex items-center">
                  <!-- 登录提示/评论输入框 -->
                  <div 
                    v-if="!isLoggedIn"
                    class="content-input"
                  >
                    <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke-width="2"/>
                    </svg>
                    <span class="text-gray-500 text-sm">登录后评论</span>
                  </div>
                  
                  <!-- 已登录状态显示评论输入框 -->
                  <div 
                    v-else
                    class="flex flex-col"
                    :class="{ 'w-full': isInputFocused }"
                  >
                    <!-- 回复提示 - 仅在回复时显示 -->
                    <div 
                      v-if="replyTo"
                      class="flex flex-col px-3 py-2 text-[14px] w-full"
                    >
                      <div class="flex items-center reply">
                        回复
                        <span class="text-[#333] mx-1">{{ replyTo.author.name }}</span>
                      </div>
                      <div class="reply-content line-clamp-1">
                        {{ replyTo.content || '[图片]' }}
                      </div>
                    </div>

                    <!-- 评论输入框 -->
                    <div 
                      class="gap-2 rounded-full flex items-center content-input"
                      :class="{
                        'w-full px-[16px]!': isInputFocused,
                        'w-[200px]': !isInputFocused
                      }"
                      @click="isInputFocused = true"
                    >
                      <!-- 头像只在未聚焦时显示 -->
                      <img 
                        v-if="!isInputFocused"
                        :src="currentUser.avatar" 
                        class="w-[24px] h-[24px] rounded-full shrink-0"
                      />
                      
                      <!-- 未聚焦时显示默认文本 -->
                      <div 
                        v-if="!isInputFocused && !commentContent" 
                        class="text-gray-500 text-sm ml-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        说点什么...
                      </div>
                      
                      <!-- 输入框 -->
                      <input 
                        type="text" 
                        placeholder="说点什么..." 
                        v-model="commentContent"
                        class="flex-1 bg-transparent focus:outline-none min-w-0"
                        :class="{
                          'ml-2 text-sm': !isInputFocused,
                          'text-[16px]': isInputFocused
                        }"
                        @blur="onInputBlur"
                        ref="commentInput"
                      />
                    </div>
                  </div>

                  <!-- 互动数据 - 仅在输入框未聚焦时显示 -->
                  <div v-if="!isInputFocused" class="flex items-center gap-4 ml-auto text-[#333]">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-gray-800">
                      <svg class="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-width="2"/>
                      </svg>
                      <span class="text-sm">1万+</span>
                    </div>
                    <div class="flex items-center gap-1 cursor-pointer hover:text-gray-800">
                      <svg class="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-sm">1万+</span>
                    </div>
                    <div 
                      class="flex items-center gap-1 cursor-pointer hover:text-gray-800"
                      @click="focusComment"
                    >
                      <svg class="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke-width="2"/>
                      </svg>
                      <span class="text-sm">10+</span>
                    </div>
                  </div>
                </div>

                <!-- 输入框聚焦时显示的底部工具栏 -->
                <div v-if="isInputFocused" class="flex items-center justify-between mt-3">
                  <div class="flex items-center gap-4">
                    <button class="p-[10px] hover:text-[#333] hover:bg-gray-100 rounded-full">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M8.5 15C8.5 15 9.8125 17 12 17C14.1875 17 15.5 15 15.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M9 10H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M15 10H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center gap-2">
                    <!-- 发送按钮 -->
                    <button 
                      class="w-[64px] h-[40px] text-[16px] text-white bg-[#ff2442] rounded-full font-bold"
                      :class="{'opacity-50': !commentContent.trim()}"
                    >
                      发送
                    </button>
                    <button class="border border-gray-200 w-[64px] h-[40px] text-[16px] 
                    font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full" @click="onCancel">
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import CommentList from './CommentList.vue'
import ImageCarousel from '@/components/common/ImageCarousel.vue'
import VideoPlayer from '@/components/common/VideoPlayer.vue'
import { getNoteDetail } from '@/api/note' // 导入获取笔记详情的API

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  note: {
    type: Object,
    default: () => ({})
  }
})

const currNote = ref({})

const emit = defineEmits(['update:visible'])

// DOM 引用
const modalRef = ref(null)
const authorInfoRef = ref(null)
const contentRef = ref(null)
const scrollContainerRef = ref(null)

// 动画相关状态
let animation = null

// 在组件卸载前清除所有动画
onBeforeUnmount(() => {
  if (animation) {
    animation.kill()
    animation = null
  }
})

// 关闭模态框
const onClose = () => {
  emit('update:visible', false)
}

// 动画相关方法
const onBeforeEnter = (el) => {
  if (modalRef.value) {
    gsap.set(modalRef.value, {
      scale: 0.8,
      opacity: 0
    })
  }
}

const onEnter = (el, done) => {
  nextTick(() => {
    if (modalRef.value) {
      animation = gsap.to(modalRef.value, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onComplete: done
      })
    } else {
      done()
    }
  })
}

const onLeave = (el, done) => {
  if (modalRef.value) {
    animation = gsap.to(modalRef.value, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: done
    })
  } else {
    done()
  }
}

const isScrolled = ref(false)

const handleScroll = (e) => {
  // 设置 isScrolled 状态
  isScrolled.value = e.target.scrollTop > 0
  
  const container = e.target
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight

  // 当滚动到距离底部 50px 时触发加载
  if (scrollHeight - scrollTop - clientHeight < 50) {
    console.log('已经滚动到最后一条评论，准备加载下一页数据...')
    loadMoreComments()
  }
}

// 评论相关数据
const comments = ref([
  {
    id: 1,
    author: {
      name: '我来也',
      description: `小红书仅一个号🥀
粉丝名：小棠宝 马甲：xxi棠
视频禁mf＋d视频哈🍁
单推/打卡/给R/改名/秒回
最后祝宝宝天天开心呀！`,
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/62fcf9ffe4f927f11989f446.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip',
      notes: '100',
      followers: '9999万',
      likes: '5.4万',
      recentNotes: [
        {
            id: 1,
          cover: 'https://sns-webpic-qc.xhscdn.com/202502241754/e9cf4d8221250b5e774249313e881717/1040g2sg31du2aavmgu605pd6nvb27ku4aercvd8!nc_n_webp_mw_1'
        }
        
      ]
    },
    content: '卿卿日常！！！！！！超好看的！！！我都三刷了！！！🐷🐷🐷🐷',
    createTime: '昨天 21:12 山东',
    likes: '7',
    image: 'https://sns-webpic-qc.xhscdn.com/202502241754/59bc2785672887f0fedc95206d12dcfd/1040g2sg31e91tv6tgm705n0u2tp1t0lgm7k9gtg!nc_n_webp_mw_1',
    replies: [
      {
        id: 2,
        author: {
          name: '田不甜',
          avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo315lngdep1e005nqm72mg97nr9s4v32g?imageView2/2/w/120/format/jpg|imageMogr2/strip'
        },
        content: '是住的那个酒店呀 真的挑不出来了都是四五百 不然就是地方特别篇😭😭',
        createTime: '昨天 21:12 山东',
        likes: '10'
      }
    ],
    hasMore: true,
    moreReplies: 7
  },
  {
    id: 3,
    author: {
      name: '妙蛙的旅行日记',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo315lngdep1e005nqm72mg97nr9s4v32g?imageView2/2/w/120/format/jpg|imageMogr2/strip'
    },
    content: '直接如家，135',
    createTime: '昨天 21:12 山东',
    likes: '10'
  }
])

const commentTotal = ref('10+')
const hasMoreComments = ref(true)
const moreCommentsCount = ref(7)

const loadMoreComments = () => {
  // 加载更多评论的逻辑
  console.log('加载更多评论')
}

// 添加登录状态控制
const isLoggedIn = ref(true)

// 模拟当前登录用户信息
const currentUser = {
  avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/645282fcfe6243cd283e03d1.jpg?imageView2/2/w/80/format/jpg?imageView2/2/w/60/format/webp|imageMogr2/strip'
}

// 评论输入框状态
const isInputFocused = ref(false)
const commentInput = ref(null)
const commentContent = ref('')

// 添加回复对象状态
const replyTo = ref(null)

// 聚焦评论输入框
const focusComment = () => {
  isInputFocused.value = true
  nextTick(() => {
    if (commentInput.value) {
      commentInput.value.focus()
    }
  })
}

// 修改回复点击处理
const onReplyClick = (comment) => {
  // 如果是二级评论，需要找到其父评论
  if (comment.isReply) {
    const parentComment = comments.value.find(c => 
      c.replies?.some(r => r.id === comment.id)
    )
    if (parentComment) {
      replyTo.value = comment
      isInputFocused.value = true
      nextTick(() => {
        if (commentInput.value) {
          commentInput.value.focus()
        }
      })
    }
  } else {
    replyTo.value = comment
    isInputFocused.value = true
    nextTick(() => {
      if (commentInput.value) {
        commentInput.value.focus()
      }
    })
  }
}

// 清除回复
const clearReply = () => {
  replyTo.value = null
}

// 修改取消评论处理
const onCancel = () => {
  isInputFocused.value = false
  commentContent.value = ''
  replyTo.value = null  // 清除回复对象
  if (commentInput.value) {
    commentInput.value.blur()
  }
}

// 输入框失焦处理
const onInputBlur = (e) => {
  // 只有点击取消按钮时才会关闭输入框
  if (e.relatedTarget?.textContent === '取消') {
    isInputFocused.value = false
  }
}

// 监听评论内容
const isCommentEmpty = computed(() => !commentContent.value.trim())

// 监听笔记变化，打印ID
watch(() => props.note, (newNote) => {
  if (newNote && newNote.id) {
    console.log('NoteDetailModal 接收到笔记ID:', newNote.id)
    getNoteDetail(newNote.id).then(res => {
      console.log(res)
      currNote.value = res.data
    })
  }
}, { immediate: true })
</script>

<style scoped>
.zoom-move {
  transition: transform 0.3s ease-out;
}

/* 防止图片溢出容器 */
img {
  max-height: 90vh;
  width: auto;
}

.title {
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
}

.content-input {
  cursor: text;
  caret-color: #ff2442;
  margin: 0px;
  height: 40px;  /* 固定高度 */
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  padding: 0 10px;  /* 调整内边距 */
  border-radius: 20px;
  outline: none;
  display: flex;
  align-items: center;
  white-space: nowrap;  /* 防止换行 */
}

/* 未聚焦状态下隐藏滚动条 */
.content-input:not(:focus-within) {
  overflow: hidden;
}

/* 限制回复内容显示一行 */
.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.reply {
    color: rgba(51, 51, 51, 0.6);
    font-size: 14px;
}

.reply-content {
    color: rgba(51, 51, 51, 0.8);
    font-size: 14px;
    width: 100%;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 隐藏输入框的默认 placeholder */
input::placeholder {
    color: transparent;
}

/* 聚焦时显示 placeholder */
input:focus::placeholder {
    color: rgba(51, 51, 51, 0.6);
}

/* 修改图片样式，确保图片适应容器 */
:deep(.carousel-container) {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.carousel-image) {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  object-position: center;
}
</style> 