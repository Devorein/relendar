import { CONFIG_INFO } from '../constants';

export function generateErrorMessage(message: string) {
  return `${CONFIG_INFO}\n**\`\`\`diff\n- ${message}\n\`\`\`**`;
}
