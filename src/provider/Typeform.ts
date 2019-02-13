import { Embed } from "../model/Embed";
import { BaseProvider } from "./BaseProvider";

class Typeform extends BaseProvider {
  private static capitalize(str: string) {
    const tmp = str.toLowerCase();
    return tmp.charAt(0).toUpperCase() + tmp.slice(1);
  }

  public getName() {
    return "Typeform";
  }

  public getPath() {
    return "typeform";
  }

  public async parseData() {
    this.setEmbedColor(0xffffff);
    console.log(this.body);

    const embed = new Embed();
    const title = `New Response - ${this.body.form_response.definition.title}`;
    console.log(title);
    embed.title = title;
    const desc = JSON.stringify(this.body.form_response.answers);
    console.log(desc);
    embed.description = desc;
    embed.url = `https://docs.google.com/spreadsheets/d/1NtUEFi6CrRgqhTPx26ayNvaMcW6SwoezWKNwNfERB7c`;
    this.addEmbed(embed);
  }
}

export { Typeform };
