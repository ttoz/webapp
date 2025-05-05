import { Effect } from 'effect';

export class MastraService {
  processText(text: string): Effect.Effect<string, Error> {
    if (!text) {
      return Effect.fail(new Error('テキストが空です'));
    }

    return Effect.succeed('AI処理済み: ' + text);
  }
}
