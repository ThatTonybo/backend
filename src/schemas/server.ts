import * as yup from 'yup'

import tags from '../../assets/serverTags.json'

export default yup.object().shape({
    name: yup.string().required(),
    short: yup.string().required().min(1).max(200),
    long: yup.string().required().min(1).max(5000),
    tags: yup.array().required().oneOf(tags as any),
    owner_name: yup.string().required().max(100),
    owner_id: yup.string().required().max(50),
    server_id: yup.string().required().max(50),
    invite: yup.string().required().max(200), // todo: URL regex check, must be app.revolt.chat valid invite)
    avatar: yup.string().required().url().max(500), // todo: URL regex check, must be *.revolt.chat/ - PNG or GIF
    vanity: yup.string().min(4).max(20)
})