import { DataSource } from 'typeorm'
import { ApiResponse, success, errors } from '../utils/response.utils'
import {
  PaperResponse,
  PatentResponse,
  BookResponse,
  ResearchOverviewResponse,
  PaperQueryParams,
  PatentQueryParams,
  BookQueryParams,
  PaginationResult
} from '../types/research.types'
import { formatDate } from '../utils/utils'

export class ResearchService {
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  /**
   * 获取科研成果概览（论文、专利、著作各前5条）
   * @returns 科研成果概览数据
   */
  async getResearchOverview(): Promise<ApiResponse<ResearchOverviewResponse>> {
    try {
      // 获取最新论文（前5条）
      const paperSql = `
        SELECT 
          id, title, title_en, abstract, abstract_en, 
          paper_publish_times, original_url
        FROM paper_infos 
        WHERE publish_status = '1' 
        ORDER BY paper_publish_times DESC, created_times DESC 
        LIMIT 5
      `

      // 获取最新专利（前5条）
      const patentSql = `
        SELECT 
          id, title, title_en, patent_publish_date, applicants, 
          application_num, is_service_patent, application_date, authorization_date,
          abstract, abstract_en
        FROM patent_infos 
        WHERE publish_status = '1' 
        ORDER BY patent_publish_date DESC, created_times DESC 
        LIMIT 5
      `

      // 获取最新著作（前5条）
      const bookSql = `
        SELECT 
          id, title, title_en, author, author_en, 
          book_publish_date, book_url, is_translated,
          abstract, abstract_en
        FROM book_infos 
        WHERE publish_status = '1' 
        ORDER BY book_publish_date DESC, created_times DESC 
        LIMIT 5
      `

      // 获取总数统计
      const paperCountSql = `SELECT COUNT(*) as total FROM paper_infos WHERE publish_status = '1'`
      const patentCountSql = `SELECT COUNT(*) as total FROM patent_infos WHERE publish_status = '1'`
      const bookCountSql = `SELECT COUNT(*) as total FROM book_infos WHERE publish_status = '1'`

      const [paperResult, patentResult, bookResult, paperCountResult, patentCountResult, bookCountResult] = await Promise.all([
        this.dataSource.query(paperSql),
        this.dataSource.query(patentSql),
        this.dataSource.query(bookSql),
        this.dataSource.query(paperCountSql),
        this.dataSource.query(patentCountSql),
        this.dataSource.query(bookCountSql)
      ])

      const papers: PaperResponse[] = paperResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        paperPublishTimes: item.paper_publish_times ? formatDate(item.paper_publish_times) : undefined,
        originalUrl: item.original_url,
        content: undefined,
        contentEn: undefined
      }))

      const patents: PatentResponse[] = patentResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        patentPublishDate: item.patent_publish_date ? formatDate(item.patent_publish_date) : undefined,
        applicants: item.applicants,
        applicationNum: item.application_num,
        isServicePatent: item.is_service_patent,
        applicationDate: formatDate(item.application_date),
        authorizationDate: item.authorization_date ? formatDate(item.authorization_date) : undefined,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        content: undefined,
        contentEn: undefined
      }))

      const books: BookResponse[] = bookResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        author: item.author,
        authorEn: item.author_en,
        bookPublishDate: item.book_publish_date ? formatDate(item.book_publish_date) : undefined,
        bookUrl: item.book_url,
        isTranslated: item.is_translated,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        content: undefined,
        contentEn: undefined
      }))

      const overview: ResearchOverviewResponse = {
        papers,
        papersTotal: parseInt(paperCountResult[0].total),
        patents,
        patentsTotal: parseInt(patentCountResult[0].total),
        books,
        booksTotal: parseInt(bookCountResult[0].total)
      }

      return success(overview, '获取科研成果概览成功')
    } catch (error: any) {
      console.error('获取科研成果概览失败:', error)
      return errors.serverError(error.message || '获取科研成果概览失败')
    }
  }

  /**
   * 分页获取论文列表
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 论文分页结果
   */
  async getPaperList(params: PaperQueryParams): Promise<ApiResponse<PaginationResult<PaperResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = ['1']

      // 标题搜索
      if (params.title && params.title.trim()) {
        whereConditions.push('(title LIKE ? OR title_en LIKE ?)')
        const titleKeyword = `%${params.title.trim()}%`
        queryParams.push(titleKeyword, titleKeyword)
      }

      // 论文发布年份查询
      if (params.publishYear) {
        whereConditions.push('YEAR(paper_publish_times) = ?')
        queryParams.push(params.publishYear)
      }

      // 论文发布月份查询
      if (params.publishMonth) {
        whereConditions.push('MONTH(paper_publish_times) = ?')
        queryParams.push(params.publishMonth)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM paper_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据
      const listSql = `
        SELECT 
          id, title, title_en, abstract, abstract_en, 
          paper_publish_times, original_url
        FROM paper_infos 
        WHERE ${whereClause} 
        ORDER BY paper_publish_times DESC, created_times DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: PaperResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        paperPublishTimes: item.paper_publish_times ? formatDate(item.paper_publish_times) : undefined,
        originalUrl: item.original_url,
        content: undefined,
        contentEn: undefined
      }))

      const result: PaginationResult<PaperResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取论文列表成功')
    } catch (error: any) {
      console.error('获取论文列表失败:', error)
      return errors.serverError(error.message || '获取论文列表失败')
    }
  }

  /**
   * 分页获取专利列表
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 专利分页结果
   */
  async getPatentList(params: PatentQueryParams): Promise<ApiResponse<PaginationResult<PatentResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件，使用参数化查询防止SQL注入
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = ['1']

      // 标题搜索（防止SQL注入）
      if (params.title && params.title.trim()) {
        whereConditions.push('(title LIKE ? OR title_en LIKE ?)')
        const titleKeyword = `%${params.title.trim()}%`
        queryParams.push(titleKeyword, titleKeyword)
      }

      // 专利发布年份查询
      if (params.publishYear) {
        whereConditions.push('YEAR(patent_publish_date) = ?')
        queryParams.push(params.publishYear)
      }

      // 专利发布月份查询
      if (params.publishMonth) {
        whereConditions.push('MONTH(patent_publish_date) = ?')
        queryParams.push(params.publishMonth)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM patent_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据
      const listSql = `
        SELECT 
          id, title, title_en, patent_publish_date, applicants, 
          application_num, is_service_patent, application_date, authorization_date,
          abstract, abstract_en
        FROM patent_infos 
        WHERE ${whereClause} 
        ORDER BY patent_publish_date DESC, created_times DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: PatentResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        patentPublishDate: item.patent_publish_date ? formatDate(item.patent_publish_date) : undefined,
        applicants: item.applicants,
        applicationNum: item.application_num,
        isServicePatent: item.is_service_patent,
        applicationDate: formatDate(item.application_date),
        authorizationDate: item.authorization_date ? formatDate(item.authorization_date) : undefined,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        content: undefined,
        contentEn: undefined
      }))

      const result: PaginationResult<PatentResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取专利列表成功')
    } catch (error: any) {
      console.error('获取专利列表失败:', error)
      return errors.serverError(error.message || '获取专利列表失败')
    }
  }

  /**
   * 分页获取著作列表
   * @param params 查询参数（包含分页和筛选条件）
   * @returns 著作分页结果
   */
  async getBookList(params: BookQueryParams): Promise<ApiResponse<PaginationResult<BookResponse>>> {
    try {
      const pageNo = params.pageNo || 1
      const pageSize = params.pageSize || 10
      const offset = (pageNo - 1) * pageSize

      // 构建查询条件，使用参数化查询防止SQL注入
      const whereConditions = ['publish_status = ?']
      const queryParams: any[] = ['1']

      // 标题搜索（防止SQL注入）
      if (params.title && params.title.trim()) {
        whereConditions.push('(title LIKE ? OR title_en LIKE ?)')
        const titleKeyword = `%${params.title.trim()}%`
        queryParams.push(titleKeyword, titleKeyword)
      }

      // 作者搜索（防止SQL注入）
      if (params.author && params.author.trim()) {
        whereConditions.push('(author LIKE ? OR author_en LIKE ?)')
        const authorKeyword = `%${params.author.trim()}%`
        queryParams.push(authorKeyword, authorKeyword)
      }

      // 著作发布年份查询
      if (params.publishYear) {
        whereConditions.push('YEAR(book_publish_date) = ?')
        queryParams.push(params.publishYear)
      }

      // 著作发布月份查询
      if (params.publishMonth) {
        whereConditions.push('MONTH(book_publish_date) = ?')
        queryParams.push(params.publishMonth)
      }

      const whereClause = whereConditions.join(' AND ')

      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM book_infos 
        WHERE ${whereClause}
      `
      const countResult = await this.dataSource.query(countSql, queryParams)
      const total = parseInt(countResult[0].total)

      // 获取分页数据
      const listSql = `
        SELECT 
          id, title, title_en, author, author_en, 
          book_publish_date, book_url, is_translated,
          abstract, abstract_en
        FROM book_infos 
        WHERE ${whereClause} 
        ORDER BY book_publish_date DESC, created_times DESC 
        LIMIT ? OFFSET ?
      `
      const listQueryParams = [...queryParams, pageSize, offset]
      const listResult = await this.dataSource.query(listSql, listQueryParams)

      const list: BookResponse[] = listResult.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        author: item.author,
        authorEn: item.author_en,
        bookPublishDate: item.book_publish_date ? formatDate(item.book_publish_date) : undefined,
        bookUrl: item.book_url,
        isTranslated: item.is_translated,
        abstract: item.abstract,
        abstractEn: item.abstract_en,
        content: undefined,
        contentEn: undefined
      }))

      const result: PaginationResult<BookResponse> = {
        list,
        total,
        pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }

      return success(result, '获取著作列表成功')
    } catch (error: any) {
      console.error('获取著作列表失败:', error)
      return errors.serverError(error.message || '获取著作列表失败')
    }
  }

  /**
   * 根据ID获取论文详情
   * @param id 论文ID
   * @returns 论文详情
   */
  async getPaperDetail(id: number): Promise<ApiResponse<PaperResponse>> {
    try {
      const sql = `
        SELECT 
          id, title, title_en, abstract, abstract_en, 
          paper_publish_times, original_url, content, content_en
        FROM paper_infos 
        WHERE id = ? AND publish_status = '1'
      `
      const result = await this.dataSource.query(sql, [id])

      if (!result || result.length === 0) {
        return errors.notFound('论文不存在或未发布')
      }

      const paper = result[0]
      const paperDetail: PaperResponse = {
        id: paper.id,
        title: paper.title,
        titleEn: paper.title_en,
        abstract: paper.abstract,
        abstractEn: paper.abstract_en,
        paperPublishTimes: paper.paper_publish_times ? formatDate(paper.paper_publish_times) : undefined,
        originalUrl: paper.original_url,
        content: paper.content,
        contentEn: paper.content_en
      }

      return success(paperDetail, '获取论文详情成功')
    } catch (error: any) {
      console.error('获取论文详情失败:', error)
      return errors.serverError(error.message || '获取论文详情失败')
    }
  }

  /**
   * 根据ID获取专利详情
   * @param id 专利ID
   * @returns 专利详情
   */
  async getPatentDetail(id: number): Promise<ApiResponse<PatentResponse>> {
    try {
      const sql = `
        SELECT 
          id, title, title_en, patent_publish_date, applicants, 
          application_num, is_service_patent, application_date, authorization_date,
          abstract, abstract_en, content, content_en
        FROM patent_infos 
        WHERE id = ? AND publish_status = '1'
      `
      const result = await this.dataSource.query(sql, [id])

      if (!result || result.length === 0) {
        return errors.notFound('专利不存在或未发布')
      }

      const patent = result[0]
      const patentDetail: PatentResponse = {
        id: patent.id,
        title: patent.title,
        titleEn: patent.title_en,
        patentPublishDate: patent.patent_publish_date ? formatDate(patent.patent_publish_date) : undefined,
        applicants: patent.applicants,
        applicationNum: patent.application_num,
        isServicePatent: patent.is_service_patent,
        applicationDate: formatDate(patent.application_date),
        authorizationDate: patent.authorization_date ? formatDate(patent.authorization_date) : undefined,
        abstract: patent.abstract,
        abstractEn: patent.abstract_en,
        content: patent.content,
        contentEn: patent.content_en
      }

      return success(patentDetail, '获取专利详情成功')
    } catch (error: any) {
      console.error('获取专利详情失败:', error)
      return errors.serverError(error.message || '获取专利详情失败')
    }
  }

  /**
   * 根据ID获取著作详情
   * @param id 著作ID
   * @returns 著作详情
   */
  async getBookDetail(id: number): Promise<ApiResponse<BookResponse>> {
    try {
      const sql = `
        SELECT 
          id, title, title_en, author, author_en, 
          book_publish_date, book_url, is_translated,
          abstract, abstract_en, content, content_en
        FROM book_infos 
        WHERE id = ? AND publish_status = '1'
      `
      const result = await this.dataSource.query(sql, [id])

      if (!result || result.length === 0) {
        return errors.notFound('著作不存在或未发布')
      }

      const book = result[0]
      const bookDetail: BookResponse = {
        id: book.id,
        title: book.title,
        titleEn: book.title_en,
        author: book.author,
        authorEn: book.author_en,
        bookPublishDate: book.book_publish_date ? formatDate(book.book_publish_date) : undefined,
        bookUrl: book.book_url,
        isTranslated: book.is_translated,
        abstract: book.abstract,
        abstractEn: book.abstract_en,
        content: book.content,
        contentEn: book.content_en
      }

      return success(bookDetail, '获取著作详情成功')
    } catch (error: any) {
      console.error('获取著作详情失败:', error)
      return errors.serverError(error.message || '获取著作详情失败')
    }
  }
}
