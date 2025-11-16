"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";

interface LanguageExample {
  javascript?: string;
  python?: string;
  curl?: string;
}

interface LanguageTabsProps {
  examples: LanguageExample;
  defaultLanguage?: "javascript" | "python" | "curl";
}

export function LanguageTabs({
  examples,
  defaultLanguage = "javascript",
}: LanguageTabsProps) {
  const availableLanguages = Object.keys(examples) as Array<
    keyof LanguageExample
  >;

  return (
    <Tabs defaultValue={defaultLanguage} className="w-full">
      <TabsList>
        {availableLanguages.map((lang) => (
          <TabsTrigger key={lang} value={lang} className="capitalize">
            {lang === "javascript"
              ? "JavaScript"
              : lang === "python"
              ? "Python"
              : "cURL"}
          </TabsTrigger>
        ))}
      </TabsList>

      {examples.javascript && (
        <TabsContent value="javascript">
          <CodeBlock code={examples.javascript} language="javascript" />
        </TabsContent>
      )}

      {examples.python && (
        <TabsContent value="python">
          <CodeBlock code={examples.python} language="python" />
        </TabsContent>
      )}

      {examples.curl && (
        <TabsContent value="curl">
          <CodeBlock code={examples.curl} language="bash" />
        </TabsContent>
      )}
    </Tabs>
  );
}
