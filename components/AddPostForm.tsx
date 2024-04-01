"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import handleSubmit from "./handleSubmitAddPostForm";
export function AddPostForm() {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');



  


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>

        <Input id="title" placeholder="Enter the title" value={title} onChange={(e) => setTitle(e.target.value)} />

      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea className="min-h-[200px]" id="content" placeholder="Enter the content" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <Button type="submit" onClick={async () => {await handleSubmit(title, content); setTitle(''); setContent('')}}>Submit</Button>
    </div>
  );
}
