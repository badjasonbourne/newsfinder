from backend.app.db.database import get_db, close_db
from backend.app.service.crawler.jina_reader import JinaReader
from backend.app.service.crawler.update_articles import all_in_one, example_extract_summary, example_extract_content
import time

def rewrite_news_by_ids(id_list: list[int]):
    """
    Rewrite content and ai_description for specified news IDs using JinaReader and all_in_one.
    
    Args:
        id_list (list[int]): List of news IDs to rewrite
    """
    reader = JinaReader()
    conn = None
    
    try:
        conn = get_db()
        cur = conn.cursor()
        
        for news_id in id_list:
            try:
                # Get the news link
                cur.execute("SELECT link FROM news WHERE id = %s", (news_id,))
                result = cur.fetchone()
                
                if not result:
                    print(f"News ID {news_id} not found")
                    continue
                
                link = result['link']
                print(f"Processing news ID {news_id} with link: {link}")
                
                # Fetch content using JinaReader
                page_content = reader.read(link)
                
                # Process with all_in_one
                processed_content = all_in_one(page_content)
                
                # Extract summary and content
                new_summary = example_extract_summary(processed_content)
                new_content = example_extract_content(processed_content)
                
                # Update the database
                cur.execute("""
                    UPDATE news 
                    SET content = %s, ai_description = %s
                    WHERE id = %s
                """, (new_content, new_summary, news_id))
                
                conn.commit()
                print(f"Successfully updated news ID: {news_id}")
                
                # Add delay to avoid overwhelming the server
                time.sleep(4)
                
            except Exception as e:
                print(f"Error processing news ID {news_id}: {str(e)}")
                conn.rollback()
                continue
                
    except Exception as e:
        print(f"Database operation failed: {str(e)}")
    finally:
        if conn:
            close_db(conn)

if __name__ == "__main__":
    # Example usage
    news_ids = list(range(80, 157))  # id range is from 80 to 157, include 80 and 157
    rewrite_news_by_ids(news_ids) 
