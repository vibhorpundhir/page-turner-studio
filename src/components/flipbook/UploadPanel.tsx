import { useState, useCallback, useRef } from 'react';
import { Upload, Image, X, Save, Globe, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface UploadPanelProps {
  title: string;
  description: string;
  fps: number;
  isPublic: boolean;
  shareUrl?: string;
  isSaving?: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onFpsChange: (fps: number) => void;
  onPublicChange: (isPublic: boolean) => void;
  onUploadFiles: (files: File[]) => void;
  onSave: () => void;
  onClear: () => void;
  pageCount: number;
}

export function UploadPanel({
  title,
  description,
  fps,
  isPublic,
  shareUrl,
  isSaving,
  onTitleChange,
  onDescriptionChange,
  onFpsChange,
  onPublicChange,
  onUploadFiles,
  onSave,
  onClear,
  pageCount,
}: UploadPanelProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setIsUploading(true);
      onUploadFiles(files);
      setTimeout(() => setIsUploading(false), 1000);
    }
  }, [onUploadFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      onUploadFiles(files);
      setTimeout(() => setIsUploading(false), 1000);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onUploadFiles]);

  return (
    <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-foreground">
            Settings
          </h2>
          {pageCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClear}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="My Flipbook"
            className="bg-secondary/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-muted-foreground">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add a description..."
            className="bg-secondary/50 border-border resize-none h-20"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Speed (FPS)</Label>
            <span className="text-sm font-medium text-primary">{fps} fps</span>
          </div>
          <Slider
            value={[fps]}
            onValueChange={([value]) => onFpsChange(value)}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2">
            {isPublic ? (
              <Globe className="w-4 h-4 text-primary" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
            <Label htmlFor="public-toggle" className="text-sm cursor-pointer">
              {isPublic ? 'Public' : 'Private'}
            </Label>
          </div>
          <Switch
            id="public-toggle"
            checked={isPublic}
            onCheckedChange={onPublicChange}
          />
        </div>

        {shareUrl && isPublic && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Share Link</p>
            <code className="text-xs text-primary break-all">{shareUrl}</code>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          Upload Files
        </h3>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`upload-zone p-8 text-center ${isDragOver ? 'drag-over' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <Image className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop files here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Supports: JPG, PNG, GIF, WebP, PDF
        </p>
      </div>

      <div className="mt-auto pt-4 space-y-4">
        <div className="flex items-center justify-between text-sm border-t border-border pt-4">
          <span className="text-muted-foreground">Total Pages</span>
          <span className="font-display font-semibold text-primary">{pageCount}</span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={onSave}
          disabled={isSaving || pageCount === 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Flipbook
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
