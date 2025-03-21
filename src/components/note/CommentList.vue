<template>
  <div class="p-[16px]" @scroll="handleScroll" ref="commentListRef">
    <!-- 只在有评论时显示评论数量 -->
    <div v-if="comments.length" class="text-[14px] ml-[8px] mb-[12px] text-gray-500">
      共 {{ total }} 条评论
    </div>
    
    <!-- 评论列表 -->
    <div>
      <CommentItem 
        v-for="comment in comments" 
        :key="comment.id" 
        :comment="comment"
        @reply="$emit('reply', $event)"
      />
    </div>

    <!-- 空评论状态 -->
    <div v-if="!comments.length" class="flex flex-col items-center py-[20px] gap-[20px]">
      <img 
        src="data:image/png;base64,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" 
        class="w-[100px] h-[100px]"
      />
      <div class="flex items-center justify-center text-[14px]">
        <div class="text-gray-500">这是一片荒地</div>
        <div 
          class="text-[#13386c] ml-[4px] cursor-pointer"
          @click="onClickComment"
        >
          点击评论
        </div>
      </div>
    </div>

    <!-- 到底了提示 -->
    <div v-if="comments.length" class="flex flex-col items-center end-container">
        - THE END - 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  total: {
    type: [Number, String],
    default: '0'
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  moreCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['load-more', 'click-comment', 'reply'])
const commentListRef = ref(null)

// 处理滚动事件
const handleScroll = (e) => {
  if (!props.comments.length || !props.hasMore) return

  const container = e.target
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight

  // 当滚动到距离底部 50px 时触发加载
  if (scrollHeight - scrollTop - clientHeight < 50) {
    console.log('已经滚动到最后一条评论，准备加载下一页数据...')
    emit('load-more')
  }
}

// 组件挂载时添加滚动监听
onMounted(() => {
  if (commentListRef.value) {
    commentListRef.value.addEventListener('scroll', handleScroll)
  }
})

// 组件卸载时移除滚动监听
onBeforeUnmount(() => {
  if (commentListRef.value) {
    commentListRef.value.removeEventListener('scroll', handleScroll)
  }
})

// 点击评论处理
const onClickComment = () => {
  emit('click-comment')
}
</script> 

<style scoped>
.end-container {
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 12px;
  line-height: 16px;
  color: rgba(51, 51, 51, 0.6);
}

</style>