<script setup lang="ts">
import { Users, MessageSquare, Settings, Link, Hash, Volume2, Plus, ChevronDown, ChevronsLeft, Bell, CircleHelp, Download, UserRound, UserRoundPlus, MessagesSquare, Paperclip, Smile, Send, Menu, Copy } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
const channel = ref('test')
const channels = ref(['FAQ', 'Random', 'test'])
const message = ref('')
const messages = ref<{ id: number; text: string; channel: string; time: string }[]>([])
const mobileOpen = ref(false)
const collapsed = ref(false)
const dialog = ref('')
const newChannel = ref('')
const channelName = ref('')
const pinnedLink = ref('')
const savedLinks = ref<string[]>([])
const voice = ref('')
const notifications = ref(true)
const attachment = ref<HTMLInputElement>()
const currentMessages = computed(() => messages.value.filter(item => item.channel === channel.value))
function selectChannel(name: string) { channel.value = name; mobileOpen.value = false }
function sendMessage() {
  if (!message.value.trim()) return
  messages.value.push({ id: Date.now(), text: message.value.trim(), channel: channel.value, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) })
  message.value = ''
}
function openSettings() { channelName.value = channel.value; dialog.value = 'settings' }
function saveSettings() {
  const name = channelName.value.trim()
  if (!name || (name !== channel.value && channels.value.includes(name))) return ElMessage.warning('Введите уникальное название канала')
  const old = channel.value
  channels.value[channels.value.indexOf(old)] = name
  messages.value.forEach(item => { if (item.channel === old) item.channel = name })
  channel.value = name; dialog.value = ''; ElMessage.success('Настройки сохранены')
}
function addChannel() {
  const name = newChannel.value.trim()
  if (!name || channels.value.includes(name)) return ElMessage.warning('Введите уникальное название')
  channels.value.push(name); selectChannel(name); newChannel.value = ''; dialog.value = ''
}
function addLink() {
  try { const url = new URL(pinnedLink.value); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); savedLinks.value.push(url.href); pinnedLink.value = ''; dialog.value = '' } catch { ElMessage.warning('Введите ссылку с https:// или http://') }
}
async function copyInvite() {
  try { await navigator.clipboard.writeText(window.location.href); ElMessage.success('Ссылка на пространство скопирована') } catch { ElMessage.info('Скопируйте адрес страницы из браузера') }
}
function attachFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) { message.value += `${message.value ? ' ' : ''}📎 ${file.name}`; ElMessage.info('Демо: добавлено имя файла, загрузка на сервер не выполняется') }
}
</script>

<template>
  <div class="workspace" :class="{ 'is-collapsed': collapsed }">
    <div v-if="mobileOpen" class="sidebar-scrim" @click="mobileOpen = false" />
    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button class="workspace-brand" @click="dialog = 'workspace'"><span class="brand-mark"><Users :size="26" fill="currentColor" /></span><strong>ETS</strong><ChevronDown :size="21" class="brand-chevron" /></button>
      <div class="sidebar-body">
        <nav class="primary-nav" aria-label="Основная навигация">
          <button class="nav-item active" @click="mobileOpen = false"><MessageSquare /><span>Общение</span></button>
          <button class="nav-item" @click="dialog = 'members'"><Users /><span>Участники</span></button>
          <button class="nav-item" @click="openSettings"><Settings /><span>Настройки</span></button>
        </nav>
        <section class="nav-section links-section">
          <div class="section-heading"><Link /><span>Ссылки</span><button aria-label="Добавить ссылку" @click="dialog = 'links'"><Plus /></button></div>
          <a v-for="link in savedLinks" :key="link" :href="link" target="_blank" rel="noopener noreferrer" class="saved-link">{{ link }}</a>
        </section>
        <section class="nav-section text-channels">
          <div class="section-heading"><Hash /><span>Текстовые каналы</span><button aria-label="Добавить текстовый канал" @click="dialog = 'channel'"><Plus /></button></div>
          <button v-for="name in channels" :key="name" class="channel-item" :class="{ selected: channel === name }" :aria-current="channel === name ? 'page' : undefined" @click="selectChannel(name)"><Hash /><span>{{ name }}</span></button>
        </section>
        <section class="nav-section voice-channels">
          <div class="section-heading"><Volume2 /><span>Голосовые каналы</span><button aria-label="О голосовых каналах" @click="dialog = 'voice'"><Plus /></button></div>
          <button v-for="number in 5" :key="number" class="channel-item" :class="{ selected: voice === `Voice #${number}` }" @click="voice = `Voice #${number}`; dialog = 'voice'"><Volume2 /><span>Voice #{{ number }}</span></button>
        </section>
      </div>
      <button class="collapse-button" :aria-label="collapsed ? 'Развернуть меню' : 'Свернуть меню'" @click="collapsed = !collapsed"><ChevronsLeft :class="{ rotated: collapsed }" /></button>
    </aside>
    <main class="main-panel">
      <header class="topbar">
        <button class="icon-button mobile-menu" aria-label="Открыть меню" @click="mobileOpen = true"><Menu /></button>
        <div class="channel-title"><Hash /><strong>{{ channel }}</strong></div>
        <div class="topbar-actions">
          <button class="icon-button notification-button" :class="{ muted: !notifications }" :aria-label="notifications ? 'Отключить уведомления' : 'Включить уведомления'" @click="notifications = !notifications; ElMessage.info(notifications ? 'Уведомления включены' : 'Уведомления отключены')"><Bell /></button>
          <button class="icon-button" aria-label="Справка" @click="dialog = 'help'"><CircleHelp /></button>
          <span class="toolbar-divider" />
          <button class="install-button" @click="dialog = 'install'"><Download /><span>Установить приложение</span></button>
          <span class="toolbar-divider account-divider" />
          <el-dropdown trigger="click" @command="dialog = $event">
            <button class="profile-button"><span class="avatar"><UserRound fill="currentColor" /></span><span>dsh16</span><ChevronDown :size="18" /></button>
            <template #dropdown><el-dropdown-menu><el-dropdown-item command="profile">Мой профиль</el-dropdown-item><el-dropdown-item command="workspace">Пространство ETS</el-dropdown-item></el-dropdown-menu></template>
          </el-dropdown>
        </div>
      </header>
      <div class="conversation">
        <div class="orb orb-top" /><div class="orb orb-bottom" />
        <div v-if="!currentMessages.length" class="welcome">
          <div class="welcome-icon"><MessagesSquare :size="66" :stroke-width="1.5" /></div>
          <h1>Канал «{{ channel }}»</h1>
          <p>Здесь можно общаться, делиться файлами и ссылками<br class="desktop-break"> с другими участниками.</p>
          <div class="welcome-actions">
            <el-button class="action-button" @click="dialog = 'invite'"><UserRoundPlus /><span>Пригласить участников</span></el-button>
            <el-button class="action-button" @click="openSettings"><Settings /><span>Настроить канал</span></el-button>
            <el-button class="action-button" @click="dialog = 'links'"><Link /><span>Закрепить ссылки</span></el-button>
          </div>
        </div>
        <div v-else class="message-list" role="log" aria-live="polite"><div class="message-intro">Начало канала # {{ channel }}</div><article v-for="item in currentMessages" :key="item.id" class="message"><span class="avatar"><UserRound fill="currentColor" /></span><div><div class="message-meta"><strong>dsh16</strong><time>{{ item.time }}</time></div><p>{{ item.text }}</p></div></article></div>
        <form class="composer" @submit.prevent="sendMessage">
          <input ref="attachment" type="file" hidden @change="attachFile">
          <button type="button" class="icon-button attach-button" aria-label="Прикрепить файл" @click="attachment?.click()"><Paperclip /></button>
          <input v-model="message" aria-label="Сообщение" placeholder="Напишите сообщение..." autocomplete="off">
          <el-popover placement="top" :width="220" trigger="click"><template #reference><button type="button" class="icon-button emoji-button" aria-label="Добавить эмодзи"><Smile /></button></template><div class="emoji-picker"><button v-for="emoji in ['😊', '👍', '❤️', '🎉', '👋', '🔥', '✅', '🚀']" :key="emoji" @click="message += emoji">{{ emoji }}</button></div></el-popover>
          <button type="submit" class="send-button" aria-label="Отправить сообщение"><Send :size="25" /></button>
        </form>
      </div>
    </main>
    <el-dialog :model-value="!!dialog" :title="({ invite: 'Пригласить участников', settings: 'Настроить канал', links: 'Закрепить ссылку', members: 'Участники', channel: 'Новый канал', help: 'Добро пожаловать в ETS', install: 'Установить приложение', profile: 'Мой профиль', workspace: 'Пространство ETS', voice: 'Голосовые каналы' } as Record<string, string>)[dialog]" width="460" align-center @close="dialog = ''">
      <template v-if="dialog === 'invite'"><p class="dialog-copy">Поделитесь ссылкой на пространство с вашей командой.</p><el-button type="success" :icon="Copy" @click="copyInvite">Скопировать приглашение</el-button></template>
      <el-form v-else-if="dialog === 'settings'" @submit.prevent="saveSettings"><el-form-item label="Название канала"><el-input v-model="channelName" maxlength="40" /></el-form-item><el-button type="success" native-type="submit">Сохранить</el-button></el-form>
      <el-form v-else-if="dialog === 'channel'" @submit.prevent="addChannel"><el-form-item label="Название"><el-input v-model="newChannel" placeholder="Например, design" maxlength="40" /></el-form-item><el-button type="success" native-type="submit">Создать канал</el-button></el-form>
      <el-form v-else-if="dialog === 'links'" @submit.prevent="addLink"><el-form-item label="Ссылка"><el-input v-model="pinnedLink" placeholder="https://" /></el-form-item><el-button type="success" native-type="submit">Закрепить</el-button></el-form>
      <div v-else-if="dialog === 'members' || dialog === 'profile'" class="member-card"><span class="avatar"><UserRound fill="currentColor" /></span><div><strong>dsh16</strong><p><span class="online-dot" /> В сети · Владелец пространства</p></div></div>
      <p v-else-if="dialog === 'help'" class="dialog-copy">Выберите канал слева и начните общение. Можно создавать каналы, закреплять ссылки и отправлять сообщения. Это демонстрация интерфейса: данные хранятся только до перезагрузки страницы.</p>
      <p v-else-if="dialog === 'install'" class="dialog-copy">Откройте меню браузера и выберите «Добавить на главный экран» или «Создать ярлык», чтобы быстро возвращаться в ETS.</p>
      <p v-else-if="dialog === 'voice'" class="dialog-copy">{{ voice ? `Вы выбрали ${voice}.` : 'Здесь будут голосовые комнаты вашей команды.' }} Голосовая связь станет доступна после подключения сервера.</p>
      <p v-else class="dialog-copy">ETS — ваше пространство для командного общения. Первая страница проекта на Nuxt 4 и Element Plus.</p>
    </el-dialog>
  </div>
</template>
