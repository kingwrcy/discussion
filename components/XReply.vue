<template>
  <div class="flex flex-col py-2 w-full" v-if="token">
    <MdEditor :theme="mode as any" ref="editorRef" style="height: 200px" @on-upload-img="onUploadImg" v-model="state.content" :preview="false" :toolbars="toolbars" :editor-id="`post-${pid}`">
      <template #defToolbars>
        <XEmoji />
        <XYoutubeDialog />
      </template>
    </MdEditor>
    <div class="flex my-2">
      <UButton @click="reply">发表评论(Ctrl+Enter提交)</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ToolbarNames } from "md-editor-v3";
import { MdEditor } from "md-editor-v3";
import type { CommentQuotedPayload } from "~/utils/eventbus";
import { useColorMode } from "@vueuse/core";

const mode = useColorMode();
const editorRef = ref();
const cid = ref();
const config = useRuntimeConfig();
const token = useCookie(config.public.tokenKey);
const props = defineProps<{
  pid: string;
}>();

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "Enter") {
    await reply();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

commentQuoted.on((param: CommentQuotedPayload) => {
  let content = "";
  if (state.content.length > 0) {
    content = "\r\n";
  } else {
  }
  content = param.edit ? param.content : content + `@${param.username} [#${param.floor}](/post/${param.pid}#${param.floor}) `;
  cid.value = param.edit ? param.cid : null;
  editorRef.value?.insert(() => {
    return {
      targetValue: content,
      select: false,
      deviationStart: state.content.length + content.length + 1,
      deviationEnd: 0
    };
  });
});

const emits = defineEmits(["commented"]);

const toolbars: ToolbarNames[] = [0, 1, "bold", "underline", "strikeThrough", "quote", "unorderedList", "orderedList", "codeRow", "code", "link", "image", "table", "preview"];
const state = reactive({
  content: ""
});

const reply = async () => {
  let res;
  if (cid.value) {
    res = await $fetch("/api/comment/renew", {
      method: "POST",
      body: JSON.stringify({
        content: state.content.trim(),
        pid: props.pid,
        cid: cid.value
      })
    });
  } else {
    res = await $fetch("/api/comment/new", {
      method: "POST",
      body: JSON.stringify({
        content: state.content.trim(),
        pid: props.pid
      })
    });
  }

  if (res.success) {
    state.content = "";
    cid.value = null;
    emits("commented");
    userCardChanged.emit();
  }
};
</script>

<style scoped></style>
