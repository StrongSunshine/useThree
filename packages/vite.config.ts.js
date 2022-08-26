// packages/vite.config.ts
import { defineConfig } from "vite";
import { resolve as resolve3 } from "path";

// packages/.vitepress/plugins/MarkdownTransform.ts
import fs2 from "fs";
import { join as join2, resolve as resolve2 } from "path";

// scripts/getTypeDefinition.ts
import { join, resolve } from "path";
import fs from "fs";
import prettier from "prettier";
import parser from "prettier/parser-typescript";
var PKG_DIR = resolve("D:\\useThree\\scripts", "../types/packages/hooks");
async function getTypeDefinition(pkg, name) {
  const typingFilepath = join(PKG_DIR, `${pkg}/${name}/index.d.ts`);
  if (!fs.existsSync(typingFilepath))
    return;
  let types = await fs.readFileSync(typingFilepath, "utf-8");
  if (!types)
    return;
  types = types.replace(/import\(.*?\)\./g, "").replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, "").replace(/export {}/g, "");
  return prettier.format(
    types,
    {
      semi: false,
      parser: "typescript",
      plugins: [parser]
    }
  ).trim();
}

// packages/.vitepress/plugins/MarkdownTransform.ts
var TYPES_DIR = resolve2("D:\\useThree\\packages\\.vitepress\\plugins", "../../../types/packages/hooks");
function MarkdownTransform() {
  const hasTypes = fs2.existsSync(TYPES_DIR);
  if (!hasTypes)
    console.warn("No types dist found, run `npm run build:types` first.");
  return {
    name: "md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null;
      const [pkg, name, i] = id.split("/").slice(-3);
      if (i === "index.md") {
        const frontmatterEnds = code.indexOf("---\n\n") + 4;
        const firstSubheader = code.search(/\n## \w/);
        const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader;
        const { footer, header } = await getFunctionMarkdown(pkg, name);
        if (hasTypes)
          code = code + "\n\n" + footer + "\n\n";
        if (header)
          code = code.slice(0, sliceIndex) + "\n\n" + header + "\n\n" + code.slice(sliceIndex);
      }
      return code;
    }
  };
}
var PKG_DIR2 = "../../hooks/";
async function getFunctionMarkdown(pkg, name) {
  const hasDemo = fs2.existsSync(join2("D:\\useThree\\packages\\.vitepress\\plugins", PKG_DIR2, pkg, name, "demo.vue"));
  const types = await getTypeDefinition(pkg, name);
  let typingSection = "";
  if (types) {
    const code = `\`\`\`typescript
${types.trim()}
\`\`\``;
    typingSection = types.length > 2e3 ? [
      "## Type Declarations",
      "<summary op50 italic>Show Type Declarations</summary>",
      "<details>",
      code,
      "</details>"
    ].join("\n\n") : `
## Type Declarations

${code}`;
  }
  const demoSection = hasDemo ? [
    "<script setup>",
    "import Demo from './demo.vue'",
    "<\/script>",
    "## Demo",
    "<DemoContainer>",
    "<Demo/>",
    "</DemoContainer>"
  ].join("\n\n") : "";
  return {
    header: demoSection,
    footer: typingSection
  };
}

// packages/vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    MarkdownTransform()
  ],
  resolve: {
    alias: {
      useThree: resolve3("D:\\useThree\\packages", "hooks")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvdml0ZS5jb25maWcudHMiLCAicGFja2FnZXMvLnZpdGVwcmVzcy9wbHVnaW5zL01hcmtkb3duVHJhbnNmb3JtLnRzIiwgInNjcmlwdHMvZ2V0VHlwZURlZmluaXRpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IE1hcmtkb3duVHJhbnNmb3JtIH0gZnJvbSAnLi8udml0ZXByZXNzL3BsdWdpbnMvTWFya2Rvd25UcmFuc2Zvcm0nXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICBNYXJrZG93blRyYW5zZm9ybSgpXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICB1c2VUaHJlZTogcmVzb2x2ZShcIkQ6XFxcXHVzZVRocmVlXFxcXHBhY2thZ2VzXCIsICdob29rcycpXG4gICAgICAgIH1cbiAgICB9XG59KVxuIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2V0VHlwZURlZmluaXRpb24gfSBmcm9tICcvc2NyaXB0cy9nZXRUeXBlRGVmaW5pdGlvbidcblxuY29uc3QgVFlQRVNfRElSID0gcmVzb2x2ZShcIkQ6XFxcXHVzZVRocmVlXFxcXHBhY2thZ2VzXFxcXC52aXRlcHJlc3NcXFxccGx1Z2luc1wiLCAnLi4vLi4vLi4vdHlwZXMvcGFja2FnZXMvaG9va3MnKVxuXG5leHBvcnQgZnVuY3Rpb24gTWFya2Rvd25UcmFuc2Zvcm0oKTogUGx1Z2luIHtcbiAgICBjb25zdCBoYXNUeXBlcyA9IGZzLmV4aXN0c1N5bmMoVFlQRVNfRElSKVxuXG4gICAgaWYgKCFoYXNUeXBlcylcbiAgICAgICAgY29uc29sZS53YXJuKCdObyB0eXBlcyBkaXN0IGZvdW5kLCBydW4gYG5wbSBydW4gYnVpbGQ6dHlwZXNgIGZpcnN0LicpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiAnbWQtdHJhbnNmb3JtJyxcbiAgICAgICAgZW5mb3JjZTogJ3ByZScsXG4gICAgICAgIGFzeW5jIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgICAgICAgLyogXHU0RUM1XHU1MzM5XHU5MTREbWRcdTY1ODdcdTY4NjMsIFxcYlx1NTMzOVx1OTE0RFx1NTM1NVx1OEJDRCAqL1xuICAgICAgICAgICAgaWYgKCFpZC5tYXRjaCgvXFwubWRcXGIvKSkgcmV0dXJuIG51bGxcblxuICAgICAgICAgICAgLyogXHU4M0I3XHU1M0Q2bWRcdTY1ODdcdTY4NjNcdTRGRTFcdTYwNkYgKi9cbiAgICAgICAgICAgIGNvbnN0IFtwa2csIG5hbWUsIGldID0gaWQuc3BsaXQoJy8nKS5zbGljZSgtMylcblxuICAgICAgICAgICAgaWYgKGkgPT09ICdpbmRleC5tZCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9udG1hdHRlckVuZHMgPSBjb2RlLmluZGV4T2YoJy0tLVxcblxcbicpICsgNFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0U3ViaGVhZGVyID0gY29kZS5zZWFyY2goL1xcbiMjIFxcdy8pXG5cbiAgICAgICAgICAgICAgICBjb25zdCBzbGljZUluZGV4ID0gZmlyc3RTdWJoZWFkZXIgPCAwID8gZnJvbnRtYXR0ZXJFbmRzIDogZmlyc3RTdWJoZWFkZXJcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgZm9vdGVyLCBoZWFkZXIgfSA9IGF3YWl0IGdldEZ1bmN0aW9uTWFya2Rvd24ocGtnLCBuYW1lKVxuXG4gICAgICAgICAgICAgICAgaWYgKGhhc1R5cGVzKVxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZSArICdcXG5cXG4nICsgZm9vdGVyICsgJ1xcblxcbidcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyKVxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZS5zbGljZSgwLCBzbGljZUluZGV4KSArICdcXG5cXG4nICsgaGVhZGVyICsgJ1xcblxcbicgKyBjb2RlLnNsaWNlKHNsaWNlSW5kZXgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2RlXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IFBLR19ESVIgPSAnLi4vLi4vaG9va3MvJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRGdW5jdGlvbk1hcmtkb3duKHBrZzogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvKiBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhkZW1vLnZ1ZSAqL1xuICAgIGNvbnN0IGhhc0RlbW8gPSBmcy5leGlzdHNTeW5jKGpvaW4oXCJEOlxcXFx1c2VUaHJlZVxcXFxwYWNrYWdlc1xcXFwudml0ZXByZXNzXFxcXHBsdWdpbnNcIiwgUEtHX0RJUiwgcGtnLCBuYW1lLCAnZGVtby52dWUnKSlcbiAgICAvKiBcdTgzQjdcdTUzRDZkLnRzXHU3QzdCXHU1NzhCXHU1QjlBXHU0RTQ5ICovXG4gICAgY29uc3QgdHlwZXMgPSBhd2FpdCBnZXRUeXBlRGVmaW5pdGlvbihwa2csIG5hbWUpXG5cbiAgICBsZXQgdHlwaW5nU2VjdGlvbiA9ICcnXG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGBcXGBcXGBcXGB0eXBlc2NyaXB0XFxuJHt0eXBlcy50cmltKCl9XFxuXFxgXFxgXFxgYFxuICAgICAgICB0eXBpbmdTZWN0aW9uID0gdHlwZXMubGVuZ3RoID4gMjAwMFxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgJyMjIFR5cGUgRGVjbGFyYXRpb25zJyxcbiAgICAgICAgICAgICAgICAnPHN1bW1hcnkgb3A1MCBpdGFsaWM+U2hvdyBUeXBlIERlY2xhcmF0aW9uczwvc3VtbWFyeT4nLFxuICAgICAgICAgICAgICAgICc8ZGV0YWlscz4nLFxuICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgJzwvZGV0YWlscz4nXG4gICAgICAgICAgICBdLmpvaW4oJ1xcblxcbicpIDogYFxcbiMjIFR5cGUgRGVjbGFyYXRpb25zXFxuXFxuJHtjb2RlfWBcbiAgICB9XG5cbiAgICBjb25zdCBkZW1vU2VjdGlvbiA9IGhhc0RlbW9cbiAgICAgICAgPyBbXG4gICAgICAgICAgICAnPHNjcmlwdCBzZXR1cD4nLFxuICAgICAgICAgICAgJ2ltcG9ydCBEZW1vIGZyb20gXFwnLi9kZW1vLnZ1ZVxcJycsXG4gICAgICAgICAgICAnPC9zY3JpcHQ+JyxcbiAgICAgICAgICAgICcjIyBEZW1vJyxcbiAgICAgICAgICAgICc8RGVtb0NvbnRhaW5lcj4nLFxuICAgICAgICAgICAgJzxEZW1vLz4nLFxuICAgICAgICAgICAgJzwvRGVtb0NvbnRhaW5lcj4nXG4gICAgICAgIF0uam9pbignXFxuXFxuJykgOiAnJ1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyOiBkZW1vU2VjdGlvbixcbiAgICAgICAgZm9vdGVyOiB0eXBpbmdTZWN0aW9uXG4gICAgfVxufVxuIiwgIi8qXG4gKiBAQXV0aG9yOiBzdHJvbmcgc3Vuc2hpbmVcbiAqIEBMYXN0RWRpdG9yczogc3Ryb25nIHN1bnNoaW5lXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA4LTE5IDE3OjM3OjIxXG4gKiBARGVzY3JpcHRpb246IFx1ODNCN1x1NTNENnR5cGUuZC50c1x1NUI5QVx1NEU0OVxuICovXG5pbXBvcnQgeyBqb2luLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwcmV0dGllciBmcm9tICdwcmV0dGllcidcbmltcG9ydCBwYXJzZXIgZnJvbSAncHJldHRpZXIvcGFyc2VyLXR5cGVzY3JpcHQnXG5cbmNvbnN0IFBLR19ESVIgPSByZXNvbHZlKFwiRDpcXFxcdXNlVGhyZWVcXFxcc2NyaXB0c1wiLCAnLi4vdHlwZXMvcGFja2FnZXMvaG9va3MnKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VHlwZURlZmluaXRpb24ocGtnOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgdHlwaW5nRmlsZXBhdGggPSBqb2luKFBLR19ESVIsIGAke3BrZ30vJHtuYW1lfS9pbmRleC5kLnRzYClcblxuICAgIGlmICghZnMuZXhpc3RzU3luYyh0eXBpbmdGaWxlcGF0aCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgbGV0IHR5cGVzID0gYXdhaXQgZnMucmVhZEZpbGVTeW5jKHR5cGluZ0ZpbGVwYXRoLCAndXRmLTgnKVxuXG4gICAgaWYgKCF0eXBlcylcbiAgICAgICAgcmV0dXJuXG5cbiAgICAvLyBcdTUzQkJcdTk2NjRcdTVCRkNcdTUxNjVcdTVCRkNcdTUxRkFcbiAgICB0eXBlcyA9IHR5cGVzXG4gICAgICAgIC5yZXBsYWNlKC9pbXBvcnRcXCguKj9cXClcXC4vZywgJycpXG4gICAgICAgIC5yZXBsYWNlKC9pbXBvcnRbXFxzXFxTXSs/ZnJvbSA/W1wiJ11bXFxzXFxTXSs/W1wiJ10vZywgJycpXG4gICAgICAgIC5yZXBsYWNlKC9leHBvcnQge30vZywgJycpXG5cbiAgICByZXR1cm4gcHJldHRpZXJcbiAgICAgICAgLmZvcm1hdChcbiAgICAgICAgICAgIHR5cGVzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbWk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHBhcnNlcjogJ3R5cGVzY3JpcHQnLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtwYXJzZXJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKVxuICAgICAgICAudHJpbSgpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxXQUFBQSxnQkFBZTs7O0FDQXhCLE9BQU9DLFNBQVE7QUFDZixTQUFTLFFBQUFDLE9BQU0sV0FBQUMsZ0JBQWU7OztBQ0k5QixTQUFTLE1BQU0sZUFBZTtBQUM5QixPQUFPLFFBQVE7QUFDZixPQUFPLGNBQWM7QUFDckIsT0FBTyxZQUFZO0FBRW5CLElBQU0sVUFBVSxRQUFRLHlCQUF5Qix5QkFBeUI7QUFFMUUsZUFBc0Isa0JBQWtCLEtBQWEsTUFBMkM7QUFDNUYsUUFBTSxpQkFBaUIsS0FBSyxTQUFTLEdBQUcsT0FBTyxpQkFBaUI7QUFFaEUsTUFBSSxDQUFDLEdBQUcsV0FBVyxjQUFjO0FBQzdCO0FBRUosTUFBSSxRQUFRLE1BQU0sR0FBRyxhQUFhLGdCQUFnQixPQUFPO0FBRXpELE1BQUksQ0FBQztBQUNEO0FBR0osVUFBUSxNQUNILFFBQVEsb0JBQW9CLEVBQUUsRUFDOUIsUUFBUSx5Q0FBeUMsRUFBRSxFQUNuRCxRQUFRLGNBQWMsRUFBRTtBQUU3QixTQUFPLFNBQ0Y7QUFBQSxJQUNHO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsU0FBUyxDQUFDLE1BQU07QUFBQSxJQUNwQjtBQUFBLEVBQ0osRUFDQyxLQUFLO0FBQ2Q7OztBRG5DQSxJQUFNLFlBQVlDLFNBQVEsK0NBQStDLCtCQUErQjtBQUVqRyxTQUFTLG9CQUE0QjtBQUN4QyxRQUFNLFdBQVdDLElBQUcsV0FBVyxTQUFTO0FBRXhDLE1BQUksQ0FBQztBQUNELFlBQVEsS0FBSyx1REFBdUQ7QUFFeEUsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsTUFBTSxVQUFVLE1BQU0sSUFBSTtBQUV0QixVQUFJLENBQUMsR0FBRyxNQUFNLFFBQVE7QUFBRyxlQUFPO0FBR2hDLFlBQU0sQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBRTdDLFVBQUksTUFBTSxZQUFZO0FBQ2xCLGNBQU0sa0JBQWtCLEtBQUssUUFBUSxTQUFTLElBQUk7QUFDbEQsY0FBTSxpQkFBaUIsS0FBSyxPQUFPLFNBQVM7QUFFNUMsY0FBTSxhQUFhLGlCQUFpQixJQUFJLGtCQUFrQjtBQUUxRCxjQUFNLEVBQUUsUUFBUSxPQUFPLElBQUksTUFBTSxvQkFBb0IsS0FBSyxJQUFJO0FBRTlELFlBQUk7QUFDQSxpQkFBTyxPQUFPLFNBQVMsU0FBUztBQUNwQyxZQUFJO0FBQ0EsaUJBQU8sS0FBSyxNQUFNLEdBQUcsVUFBVSxJQUFJLFNBQVMsU0FBUyxTQUFTLEtBQUssTUFBTSxVQUFVO0FBQUEsTUFDM0Y7QUFFQSxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFDSjtBQUVBLElBQU1DLFdBQVU7QUFFaEIsZUFBZSxvQkFBb0IsS0FBYSxNQUFjO0FBRTFELFFBQU0sVUFBVUQsSUFBRyxXQUFXRSxNQUFLLCtDQUErQ0QsVUFBUyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBRWpILFFBQU0sUUFBUSxNQUFNLGtCQUFrQixLQUFLLElBQUk7QUFFL0MsTUFBSSxnQkFBZ0I7QUFFcEIsTUFBSSxPQUFPO0FBQ1AsVUFBTSxPQUFPO0FBQUEsRUFBcUIsTUFBTSxLQUFLO0FBQUE7QUFDN0Msb0JBQWdCLE1BQU0sU0FBUyxNQUN6QjtBQUFBLE1BQ0U7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSixFQUFFLEtBQUssTUFBTSxJQUFJO0FBQUE7QUFBQTtBQUFBLEVBQTZCO0FBQUEsRUFDdEQ7QUFFQSxRQUFNLGNBQWMsVUFDZDtBQUFBLElBQ0U7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKLEVBQUUsS0FBSyxNQUFNLElBQUk7QUFFckIsU0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLEVBQ1o7QUFDSjs7O0FEM0VBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLGtCQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxVQUFVRSxTQUFRLDBCQUEwQixPQUFPO0FBQUEsSUFDdkQ7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJmcyIsICJqb2luIiwgInJlc29sdmUiLCAicmVzb2x2ZSIsICJmcyIsICJQS0dfRElSIiwgImpvaW4iLCAicmVzb2x2ZSJdCn0K
