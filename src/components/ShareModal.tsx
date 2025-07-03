import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Globe, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  projectId?: string | number;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  projectName = 'Project', 
  projectId = '1' 
}) => {
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  // Generate a shareable link
  const shareableLink = `${window.location.origin}/shared/${projectId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  const sendInvite = () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Here you would typically call an API to send the invitation
    toast.success(`Invitation sent to ${email}`);
    setEmail('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {projectName}
          </DialogTitle>
          <DialogDescription>
            Invite collaborators or share a public link to your project
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Public Link Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                Public Link
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsPublic(!isPublic)}
              >
                {isPublic ? 'Disable' : 'Enable'}
              </Button>
            </div>
            
            {isPublic && (
              <div className="flex items-center space-x-2">
                <Input 
                  value={shareableLink}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Invite Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              Invite People
            </h3>
            
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendInvite}>Invite</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
