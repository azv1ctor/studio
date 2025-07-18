
'use server';

/**
 * @fileOverview A flow to generate AI-powered summaries of reports.
 *
 * - generateReportSummary - A function that generates a summary of a given report.
 * - GenerateReportSummaryInput - The input type for the generateReportSummary function.
 * - GenerateReportSummaryOutput - The return type for the generateReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSummaryInputSchema = z.object({
  reportType: z.string().describe('The type of report to summarize (e.g., Stock Movements, Pending Purchase Requests, Unusual Employee Activities).'),
  reportData: z.string().describe('The data of the report to summarize.'),
});
export type GenerateReportSummaryInput = z.infer<typeof GenerateReportSummaryInputSchema>;

const GenerateReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A succinct summary of the report data.'),
});
export type GenerateReportSummaryOutput = z.infer<typeof GenerateReportSummaryOutputSchema>;

export async function generateReportSummary(input: GenerateReportSummaryInput): Promise<GenerateReportSummaryOutput> {
  return generateReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: GenerateReportSummaryInputSchema},
  output: {schema: GenerateReportSummaryOutputSchema},
  prompt: `Você é um assistente de IA encarregado de resumir relatórios para um sistema de gerenciamento de estoque. Sua principal tarefa é fornecer um resumo sucinto e de fácil compreensão dos dados do relatório.

**Instruções Importantes:**
1.  **Sempre responda em português do Brasil.**
2.  **Nunca inclua IDs** (como ID do produto, ID do funcionário, etc.) em seu resumo. Em vez disso, use os nomes correspondentes (nome do produto, nome do funcionário, etc.).
3.  Seja breve e foque nos pontos mais importantes.

Tipo de Relatório: {{{reportType}}}
Dados do Relatório: {{{reportData}}}

Resumo conciso:`,
});

const generateReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateReportSummaryFlow',
    inputSchema: GenerateReportSummaryInputSchema,
    outputSchema: GenerateReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
