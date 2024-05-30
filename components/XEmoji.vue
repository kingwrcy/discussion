<template>
  <div>
    <DropdownToolbar title="emoji" :visible="state.visibile" :onChange="onChange">
    <template #overlay>
      <div class="p-2 relative left-2 top-2 grid grid-cols-10 gap-1 *:cursor-pointer *:border *:rounded max-h-[150px] overflow-auto">
        <div v-for="emoji in emojis" >
          <div @click="insertEmoji(emoji)" :key="emoji">{{ emoji }}</div>
        </div>
      </div>
    </template>
    <template #trigger>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32" style="display: block">
        <path fill="#888888" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12" />
        <path fill="#888888"
          d="M11.5 11a2.5 2.5 0 1 0 2.5 2.5a2.48 2.48 0 0 0-2.5-2.5m9 0a2.5 2.5 0 1 0 2.5 2.5a2.48 2.48 0 0 0-2.5-2.5M9 20a8.13 8.13 0 0 0 14 0z" />
      </svg>
    </template>
  </DropdownToolbar>
  </div>
</template>

<script lang="ts" setup>
import { DropdownToolbar, type Insert } from 'md-editor-v3';
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😶‍🌫️', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '🫨', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴','😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','☹️', '😮', '😯', '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩'
];


const props = defineProps({

  insert: {
    type: Function as PropType<Insert>,
    default: () => {
      //
    }
  }
});

const insertEmoji = (emoji: string) => {
  props.insert(() => {
    return {
      targetValue: emoji,
      select: false,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
  state.visibile = false
}

const state = reactive({
  visibile:false
})

const onChange = (visbile: boolean) => {
  state.visibile = visbile
}
</script>

<style scoped></style>