from pydantic import BaseModel


class StatsCard(BaseModel):
    total_books: int
    read_books: int
    reading_books: int
    planned_books: int
    total_pages_read: int
    library_value: int          # в копейках


class DistributionItem(BaseModel):
    label: str
    value: int
    percent: float
    color: str


class MonthlyPoint(BaseModel):
    month: str          # "Янв", "Фев", ...
    value: int


class AnalyticsResponse(BaseModel):
    stats: StatsCard
    by_status: list[DistributionItem]
    by_genre: list[DistributionItem]
    books_by_month: list[MonthlyPoint]
    spending_by_month: list[MonthlyPoint]