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
  prompt: `Você é um assistente de IA encarregado de resumir relatórios para um sistema de gerenciamento de estoque. Você deve fornecer um resumo sucinto e de fácil compreensão dos dados do relatório fornecidos. **Sua resposta deve ser sempre em português do Brasil.**

Tipo de Relatório: {{{reportType}}}
Dados do Relatório: {{{reportData}}}

Resumo:`,
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
