export interface Countries {
    countryCode: string,
    name: string,
    flag: string
}

export interface APIKey {
    key: string,
    value: string
}

export interface Articles {
    sourceName: string,
    author: string,
    title: string,
    description: string,
    url: string,
    image: string,
    publishedAt: string,
    content: string,
    saved: Boolean
}

export interface TopHeadline {
    countryCode: string,
    queryDate: Date,
    articles: Articles[]
}