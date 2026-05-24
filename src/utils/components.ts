import type {
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
} from "discord.js";

export function separator(spacing = 1) {
  return (separator: SeparatorBuilder) => separator.setSpacing(spacing);
}

export function textDisplay(text: string) {
  return (textDisplay: TextDisplayBuilder) => textDisplay.setContent(text);
}

export function mediaGalleryItem(url: string, description?: string) {
  return (mediaGalleryItem: MediaGalleryItemBuilder) => {
    if (description) mediaGalleryItem.setDescription(description);
    return mediaGalleryItem.setURL(url);
  };
}
