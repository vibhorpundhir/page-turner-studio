import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/flipbook/Navbar';
import { PageThumbnails } from '@/components/flipbook/PageThumbnails';
import { FlipbookPreview } from '@/components/flipbook/FlipbookPreview';
import { FlipbookControls } from '@/components/flipbook/FlipbookControls';
import { UploadPanel } from '@/components/flipbook/UploadPanel';
import { useFlipbook } from '@/hooks/useFlipbook';
import { useFlipbookStorage } from '@/hooks/useFlipbookStorage';
import { PanelLeftClose, PanelRightClose, PanelLeft, PanelRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlipbookBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
    setPages,
  } = useFlipbook();

  const {
    isSaving,
    isLoading,
    uploadImages,
    saveFlipbook,
    loadFlipbook,
  } = useFlipbookStorage();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [currentFlipbookId, setCurrentFlipbookId] = useState<string | undefined>(id);
  const [shareUrl, setShareUrl] = useState<string | undefined>();

  // Load existing flipbook if editing
  useEffect(() => {
    if (id) {
      loadFlipbook(id).then(result => {
        if (result) {
          setTitle(result.flipbook.title);
          setDescription(result.flipbook.description || '');
          setFps(result.flipbook.fps);
          setIsPublic(result.flipbook.is_public);
          setCurrentFlipbookId(result.flipbook.id);
          if (result.flipbook.is_public) {
            setShareUrl(`${window.location.origin}/view/${result.flipbook.slug}`);
          }
          
          // Convert database pages to local state
          const loadedPages = result.pages.map((p, i) => ({
            id: p.id,
            imageUrl: p.image_url,
            order: p.page_order,
          }));
          setPages(loadedPages);
        }
      });
    }
  }, [id, loadFlipbook, setTitle, setDescription, setFps, setPages]);

  const handleUploadFiles = useCallback(async (files: File[]) => {
    // Filter image files only (PDF support would need backend processing)
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      // For now, show that PDF isn't supported in frontend-only mode
      // PDF processing would require a backend edge function
      return;
    }

    const uploadedUrls = await uploadImages(imageFiles);
    if (uploadedUrls.length > 0) {
      addPages(uploadedUrls);
    }
  }, [uploadImages, addPages]);

  const handleSave = useCallback(async () => {
    const savedFlipbook = await saveFlipbook(
      {
        id: currentFlipbookId,
        title,
        description,
        fps,
        isPublic,
      },
      pages.map((page, index) => ({
        imageUrl: page.imageUrl,
        order: index,
        sourceType: 'image',
        pageNumber: index + 1,
      }))
    );

    if (savedFlipbook) {
      setCurrentFlipbookId(savedFlipbook.id);
      if (savedFlipbook.is_public) {
        setShareUrl(`${window.location.origin}/view/${savedFlipbook.slug}`);
      } else {
        setShareUrl(undefined);
      }
      
      // Update URL if this was a new flipbook
      if (!id && savedFlipbook.id) {
        navigate(`/builder/${savedFlipbook.id}`, { replace: true });
      }
    }
  }, [currentFlipbookId, title, description, fps, isPublic, pages, saveFlipbook, id, navigate]);

  const handleNewProject = useCallback(() => {
    clearPages();
    setCurrentFlipbookId(undefined);
    setShareUrl(undefined);
    setIsPublic(false);
    setTitle('Untitled Flipbook');
    setDescription('');
    navigate('/builder', { replace: true });
  }, [clearPages, setTitle, setDescription, navigate]);

  if (isLoading && id) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        title={title} 
        onTitleChange={setTitle}
        onNewProject={handleNewProject}
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
            isPublic={isPublic}
            shareUrl={shareUrl}
            isSaving={isSaving}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onFpsChange={setFps}
            onPublicChange={setIsPublic}
            onUploadFiles={handleUploadFiles}
            onSave={handleSave}
            onClear={handleNewProject}
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
          isPublic={isPublic}
          shareUrl={shareUrl}
          isSaving={isSaving}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFpsChange={setFps}
          onPublicChange={setIsPublic}
          onUploadFiles={handleUploadFiles}
          onSave={handleSave}
          onClear={handleNewProject}
          pageCount={pages.length}
        />
      </div>
    </div>
  );
}
