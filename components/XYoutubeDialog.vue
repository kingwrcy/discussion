<template>
  <DropdownToolbar title="emoji" :visible="state.visibile" :onChange="onChange">
    <template #overlay>
      <div class="flex flex-col space-y-2 items-start border p-2">
        <UFormGroup label="Youtube地址" name="youtubeUrl">
          <UInput v-model="youtubeUrl" autocomplete="off" />
        </UFormGroup>
        <UButton type="button" @click="insertYoutube">
          插入
        </UButton>
      </div>
    </template>
    <template #trigger>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" >
        <path fill="#888888"
          d="M29.41 9.26a3.5 3.5 0 0 0-2.47-2.47C24.76 6.2 16 6.2 16 6.2s-8.76 0-10.94.59a3.5 3.5 0 0 0-2.47 2.47A36.13 36.13 0 0 0 2 16a36.13 36.13 0 0 0 .59 6.74a3.5 3.5 0 0 0 2.47 2.47c2.18.59 10.94.59 10.94.59s8.76 0 10.94-.59a3.5 3.5 0 0 0 2.47-2.47A36.13 36.13 0 0 0 30 16a36.13 36.13 0 0 0-.59-6.74M13.2 20.2v-8.4l7.27 4.2Z" />
      </svg>
    </template>
  </DropdownToolbar>
</template>

<script lang="ts" setup>
import { DropdownToolbar, type Insert } from 'md-editor-v3';

const youtubeUrl = ref('')
const props = defineProps({

  insert: {
    type: Function as PropType<Insert>,
    default: () => {
      //
    }
  }
});

const youtubeUrlRegs = [/v=([^&#]+)/, /youtu\.be\/(.*)\?/]

const insertYoutube = () => {
  for (let i = 0; i < youtubeUrlRegs.length; i++) {
    const reg = youtubeUrlRegs[i]
    const match = youtubeUrl.value.match(reg)
    if (match) {
      props.insert(() => {
        return {
          targetValue: `<iframe class="w-full h-[400px] my-2" src="https://www.youtube.com/embed/${match[1]}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>\n`,
          select: false,
          deviationStart: 0,
          deviationEnd: 0
        }
      })
      state.visibile = false
      return
    }
  }
  youtubeUrl.value = ''
  state.visibile = false
}

const state = reactive({
  visibile: false
})

const onChange = (visbile: boolean) => {
  state.visibile = visbile
}
</script>

<style scoped></style>