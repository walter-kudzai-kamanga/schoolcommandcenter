from celery import shared_task

@shared_task
def send_daily_reminders():
    # Example: send daily reminders to staff or students
    print('Daily reminders sent!') 