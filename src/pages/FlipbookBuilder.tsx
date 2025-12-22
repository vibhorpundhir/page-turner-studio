import { useState } from 'react';
import { Navbar } from '@/components/flipbook/Navbar';
import { PageThumbnails } from '@/components/flipbook/PageThumbnails';
import { FlipbookPreview } from '@/components/flipbook/FlipbookPreview';
import { FlipbookControls } from '@/components/flipbook/FlipbookControls';
import { UploadPanel } from '@/components/flipbook/UploadPanel';
import { useFlipbook } from '@/hooks/useFlipbook';
import { PanelLeftClose, PanelRightClose, PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlipbookBuilder() {
  const {
    pages,
    currentPage,
    isPlaying,
    fps,
    title,
    description,
    addPages,
    removePage,
    duplicatePage,
    reorderPages,
    nextPage,
    prevPage,
    goToPage,
    togglePlay,
    setFps,
    setTitle,
    setDescription,
    clearPages,
  } = useFlipbook();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        title={title} 
        onTitleChange={setTitle}
        onNewProject={clearPages}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Page Thumbnails */}
        <aside 
          className={`border-r border-border bg-card/30 transition-all duration-300 flex-shrink-0 ${
            leftPanelOpen ? 'w-64' : 'w-0'
          } hidden md:block overflow-hidden`}
        >
          <PageThumbnails
            pages={pages}
            currentPage={currentPage}
            onPageSelect={goToPage}
            onPageDelete={removePage}
            onPageDuplicate={duplicatePage}
            onReorder={reorderPages}
          />
        </aside>

        {/* Main Content - Preview */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Panel toggle buttons */}
          <div className="absolute top-4 left-4 z-10 hidden md:flex gap-2">
            <Button
              variant="icon"
              size="icon-sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            >
              {leftPanelOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 hidden md:flex gap-2">
            <Button
              variant="icon"
              size="icon-sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              {rightPanelOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRight className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-hidden">
            <FlipbookPreview
              pages={pages}
              currentPage={currentPage}
              isPlaying={isPlaying}
            />
          </div>

          {/* Controls */}
          <div className="border-t border-border bg-card/30 backdrop-blur-sm">
            <FlipbookControls
              currentPage={currentPage}
              totalPages={pages.length}
              isPlaying={isPlaying}
              fps={fps}
              onPrevPage={prevPage}
              onNextPage={nextPage}
              onTogglePlay={togglePlay}
              onGoToPage={goToPage}
            />
          </div>
        </main>

        {/* Right Panel - Upload & Settings */}
        <aside 
          className={`border-l border-border bg-card/30 transition-all duration-300 flex-shrink-0 ${
            rightPanelOpen ? 'w-72' : 'w-0'
          } hidden md:block overflow-hidden`}
        >
          <UploadPanel
            title={title}
            description={description}
            fps={fps}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onFpsChange={setFps}
            onUploadImages={addPages}
            onClear={clearPages}
            pageCount={pages.length}
          />
        </aside>
      </div>

      {/* Mobile Bottom Sheet for Upload */}
      <div className="md:hidden border-t border-border bg-card p-4">
        <UploadPanel
          title={title}
          description={description}
          fps={fps}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFpsChange={setFps}
          onUploadImages={addPages}
          onClear={clearPages}
          pageCount={pages.length}
        />
      </div>
    </div>
  );
}
