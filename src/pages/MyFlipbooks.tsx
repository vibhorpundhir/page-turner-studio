import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlipbookStorage, DbFlipbook } from '@/hooks/useFlipbookStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Book, Trash2, ExternalLink, Loader2, ArrowLeft, Globe, Lock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function MyFlipbooks() {
  const { listFlipbooks, deleteFlipbook, isLoading } = useFlipbookStorage();
  const [flipbooks, setFlipbooks] = useState<DbFlipbook[]>([]);

  useEffect(() => {
    listFlipbooks().then(setFlipbooks);
  }, [listFlipbooks]);

  const handleDelete = async (id: string) => {
    const success = await deleteFlipbook(id);
    if (success) {
      setFlipbooks(prev => prev.filter(f => f.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">My Flipbooks</h1>
              <p className="text-sm text-muted-foreground">{flipbooks.length} flipbook{flipbooks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/builder">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : flipbooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
              <Book className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">No Flipbooks Yet</h2>
            <p className="text-muted-foreground mb-6">Create your first flipbook to get started</p>
            <Button asChild>
              <Link to="/builder">
                <Plus className="w-4 h-4 mr-2" />
                Create Flipbook
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flipbooks.map((flipbook) => (
              <Card key={flipbook.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{flipbook.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {flipbook.is_public ? (
                          <>
                            <Globe className="w-3 h-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            Private
                          </>
                        )}
                        <span>•</span>
                        <span>{flipbook.fps} FPS</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {flipbook.description || 'No description'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Updated {formatDate(flipbook.updated_at)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/builder/${flipbook.id}`}>
                        Edit
                      </Link>
                    </Button>
                    {flipbook.is_public && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/view/${flipbook.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Flipbook?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{flipbook.title}" and all its pages. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(flipbook.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
