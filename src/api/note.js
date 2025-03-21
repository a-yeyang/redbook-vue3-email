import axios from "@/axios";

// 接口前缀
const API_PREFIX = '/note'

// 发布笔记
export function publishNote(note) {
    return axios.post(`${API_PREFIX}/note/publish`, note)
}

// 获取发现页笔记数据
export function getDiscoverNotePageList(channelId, pageNo) {
    return axios.post(`${API_PREFIX}/discover/note/list`, {channelId, pageNo})
}

// 获取笔记详情
export function getNoteDetail(id) {
    return axios.post(`${API_PREFIX}/note/detail`, {id})
}

