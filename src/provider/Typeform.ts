import { Embed } from '../model/Embed'
import { BaseProvider } from './BaseProvider'

class Typeform extends BaseProvider {
  private static capitalize(str: string) {
    const tmp = str.toLowerCase()
    return tmp.charAt(0).toUpperCase() + tmp.slice(1)
  }

  public getName() {
    return 'Typeform'
  }

  public getPath() {
    return 'typeform'
  }

  public getFieldTitle(fields: object, id: string): string {
    for (const field in fields) {
      if (field['id'] === id) {
        return field['title']
      }
    }
    return 'N/A'
  }

  public async parseData() {
    // const example = {
    //   "event_id": "01E4EBQY21AQ3244JW4DX0JYNZ",
    //   "event_type": "form_response",
    //   "form_response": {
    //     "form_id": "ngSjD1",
    //     "token": "01E4EBQY21AQ3244JW4DX0JYNZ",
    //     "landed_at": "2020-03-27T16:03:33Z",
    //     "submitted_at": "2020-03-27T16:03:33Z",
    //     "definition": {
    //       "id": "ngSjD1",
    //       "title": "Thai National ID Card OCR",
    //       "fields": [
    //         {
    //           "id": "sI10AurVdtZI",
    //           "title": "ชื่อ-นามสกุล",
    //           "type": "short_text",
    //           "ref": "16d29a6d-41be-4208-99e4-ae92878430fa",
    //           "properties": {}
    //         },
    //         {
    //           "id": "EviR9NRCj67a",
    //           "title": "หน่วยงาน",
    //           "type": "short_text",
    //           "ref": "13902807-5d94-42a3-8b05-92576abd0117",
    //           "properties": {}
    //         },
    //         {
    //           "id": "mNSwCdUJQgdr",
    //           "title": "อีเมล์",
    //           "type": "email",
    //           "ref": "bf4eb029-e517-4382-9a40-81e7e82c0514",
    //           "properties": {}
    //         },
    //         {
    //           "id": "mLTTl81yVDQl",
    //           "title": "เบอร์โทรศัพท์",
    //           "type": "number",
    //           "ref": "8a322d29-b071-4b05-9b5b-9e0a4dee7d78",
    //           "properties": {}
    //         },
    //         {
    //           "id": "QPRFRBVt5zEN",
    //           "title": "ท่านสนใจนำไปใช้งานในเรื่องอะไร",
    //           "type": "long_text",
    //           "ref": "39702f97-8d69-4dd1-a348-73605b6f57b0",
    //           "properties": {}
    //         },
    //         {
    //           "id": "cVxMWIHlJ1rR",
    //           "title": "ท่านสนใจจะใช้ Thai National Card OCR ในรูปแบบใด",
    //           "type": "multiple_choice",
    //           "ref": "161ce29f-a021-4083-9bdc-050ef990af7b",
    //           "properties": {},
    //           "choices": [
    //             {
    //               "id": "WULFhJQGOcPG",
    //               "label": "On Cloud (เรียก API)"
    //             },
    //             {
    //               "id": "Rit8sJwWJWUj",
    //               "label": "On Premise (ติดตั้งที่ Server ของท่าน)"
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     "answers": [
    //       {
    //         "type": "text",
    //         "text": "Lorem ipsum dolor",
    //         "field": {
    //           "id": "sI10AurVdtZI",
    //           "type": "short_text",
    //           "ref": "16d29a6d-41be-4208-99e4-ae92878430fa"
    //         }
    //       },
    //       {
    //         "type": "text",
    //         "text": "Lorem ipsum dolor",
    //         "field": {
    //           "id": "EviR9NRCj67a",
    //           "type": "short_text",
    //           "ref": "13902807-5d94-42a3-8b05-92576abd0117"
    //         }
    //       },
    //       {
    //         "type": "email",
    //         "email": "an_account@example.com",
    //         "field": {
    //           "id": "mNSwCdUJQgdr",
    //           "type": "email",
    //           "ref": "bf4eb029-e517-4382-9a40-81e7e82c0514"
    //         }
    //       },
    //       {
    //         "type": "number",
    //         "number": 42,
    //         "field": {
    //           "id": "mLTTl81yVDQl",
    //           "type": "number",
    //           "ref": "8a322d29-b071-4b05-9b5b-9e0a4dee7d78"
    //         }
    //       },
    //       {
    //         "type": "text",
    //         "text": "Lorem ipsum dolor",
    //         "field": {
    //           "id": "QPRFRBVt5zEN",
    //           "type": "long_text",
    //           "ref": "39702f97-8d69-4dd1-a348-73605b6f57b0"
    //         }
    //       },
    //       {
    //         "type": "choice",
    //         "choice": {
    //           "label": "Barcelona"
    //         },
    //         "field": {
    //           "id": "cVxMWIHlJ1rR",
    //           "type": "multiple_choice",
    //           "ref": "161ce29f-a021-4083-9bdc-050ef990af7b"
    //         }
    //       }
    //     ]
    //   }

    this.setEmbedColor(0xffffff)
    console.log(this.body)

    const embed = new Embed()
    const title = `มีลูกค้าสนใจสินค้าของเรา 🥰🥰🥰 New Response - ${this.body.form_response.definition.title} 🥰🥰🥰`
    embed.title = title

    let desc = ''

    const fields = this.body.form_response.definition.fields

    for (let i = 0; i < this.body.form_response.answers.length; i++) {
      const answer = this.body.form_response.answers[i]
      if (answer.type === 'text') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.text
      } else if (answer.type === 'email') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.email
      } else if (answer.type === 'number') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.number + ''
      } else if (answer.type === 'choice') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.choice.label
      } else if (answer.type === 'date') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.date
      } else if (answer.type === 'choices') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.choice.labels.join(', ')
      } else if (answer.type === 'boolean') {
        desc += (i + 1) + '. ' + this.getFieldTitle(fields, answer.field.id) + ': ' + answer.boolean
      }
      desc += '\n'
    }
    embed.description = desc + "@kobkrit @pawarana @Kwang @Plawan @khomson"
    embed.url = `https://admin.typeform.com/form/${this.body.form_response.form_id}/results#responses`
    this.addEmbed(embed)
  }
}

export { Typeform }
