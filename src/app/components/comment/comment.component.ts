import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Comment } from '../../models/models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment = {
    id: "",
    cardId: "",
    userId: "",
    content: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    
  }

  loadComment(): void {
    this.boardService.getComment(this.comment.id).subscribe(
      (data: any) => {
      this.comment = data;
    });
  }

  updateComment(comment: Comment): void {
    this.boardService.updateComment(comment).subscribe(() => {
      this.loadComment();
    });
  }

  deleteComment(commentId: string): void {
    this.boardService.deleteComment(commentId).subscribe(() => {
      this.loadComment();
    });
  }
}

