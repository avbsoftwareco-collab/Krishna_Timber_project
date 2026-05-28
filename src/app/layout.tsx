// // app/layout.tsx
// import './globals.css';
// import Providers from "./providers";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen w-full overflow-x-hidden antialiased">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import Providers from "./providers";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}