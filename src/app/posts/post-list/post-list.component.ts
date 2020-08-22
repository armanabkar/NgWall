import { AuthService } from './../../auth/auth.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(
    public postsService: PostService,
    private authService: AuthService
  ) {}

  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPost = 0;
  postsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [10, 25, 100, 200];
  userId: string;
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPost = postData.postCount;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangePage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
