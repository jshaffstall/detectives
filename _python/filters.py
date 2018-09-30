from .hooks import data

def dateformat(value, format="%d-%b-%Y"):
    return value.strftime(format)

def mysteries(value, which):
    # The value passed in should be a category slug
    if which == 'categories':
        for category in data['categories']:
            if category == value:
                return data['categories'][category]['mysteries']

    # The value passed in should be an author slug
    if which == 'author':
        for author in data['authors']:
            if author == value:
                return data['authors'][author]['mysteries']
                    
    return []

# The value passed in should be a series slug
# Mysteries will be returned in series order
def series(value):
    if value == '*':
        return data['series']
    
    for series in data['series']:
        if series == value:
            data['series'][series].sort(key=_series_order)
            
            return data['series'][series]
        
    return []

# The value passed in should be an author slug
def author(value):
    for author in data['authors']:
        if author == value:
            return data['authors'][author]['author']
        
    return []

# The value passed in should be a category slug
def category(value):
    for cat in data['categories']:
        if cat == value:
            return data['categories'][value]['category']
        
    return []
    
filters = {}
filters['dateformat'] = dateformat
filters['mysteries'] = mysteries
filters['series'] = series
filters['author'] = author
filters['category'] = category

def _series_order(item):
    return item['series']['order']
    