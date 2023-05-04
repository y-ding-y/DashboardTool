export const getInputAttrs = (item, proxy) => {
    const def = {
        class: 'select',
        allowClear: true,
        placeholder: proxy.$t('plsInput') + '...',
    }
    return { ...def, ...(item.attrs || {}) }
}
export const getMaxTagCount = (item) => {
    return item.maxTagCount ??
        (Array.isArray(item.value) && item.value.length > 1)
        ? item.maxTagCount
        : 1
}
export const getSelectAttrs = (item, proxy) => {
    const def = {
        class: 'select',
        allowClear: true,
        showArrow: true,
        showSearch: true,
        dropdownMatchSelectWidth: false,
        placeholder: proxy.$t('plsSelect') + '...',

    }
    return { ...def, ...(item.attrs || {}) }
}

export const onFilterOption = (input, option) => {
    const { value, label, } = option
    const rtn = (value + '*' + label)
        .toLowerCase()
        .includes(input.toLowerCase())
    return rtn
}

export const getTitle = (item, lang, proxy) => {
    let title = ''
    if (item.title !== '' && item.title !== null) {
        title = item['title_' + lang] || item.title || proxy.$t(item.key)
    } else {
        title = ''
    }
    title += item.type != 'input' && title ? '' : ''
    return title
}

export const getFormat = (item) => {
    if (item && item.format) {
        return item.format
    }
    const type = item.type
    switch (type) {
        case 'time':
            return 'HH:mm:ss'
        case 'month':
            return 'YYYY-MM'
        case 'date':
        case 'range':
            return 'MM-DD HH'
        case 'datetime':
            return 'YYYY-MM-DD HH:mm:ss'
        default:
            return undefined
    }
}
