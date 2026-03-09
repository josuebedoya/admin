import {Open_Sans} from 'next/font/google';
import '@/app/globals.css';
import "flatpickr/dist/flatpickr.css";
import {SidebarProvider} from '@/context/SidebarContext';
import {ThemeProvider} from '@/context/ThemeContext';
import QueryProvider from '@/providers/QueryProvider';

const font = Open_Sans({
  subsets: ["latin"],
});

export default function RootLayout({children}: { children: React.ReactNode }) {

  return (
    <html lang="en">
    <body className={`${font.className} dark:bg-gray-900`}>
    <QueryProvider>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
    </body>
    </html>
  );
};
